import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Location } from '@angular/common'; 
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Ingredients } from '../../models/recipe.models';
import { IngredientTableComponent } from '../ingredient-table/ingredient-table.component';
import { CATEGORIES, EDIT_MODE } from '../../constants/categories';
import { UploadComponent } from '../upload/upload.component';
import { RecipeService } from '../../services/recipe.service';
import { finalize } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from '../../core/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [
    CardModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ToolbarModule,
    ButtonModule,
    ReactiveFormsModule,
    IngredientTableComponent,
    UploadComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './create-recipe.component.html',
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateRecipeComponent {
  files: any = [];

  private readonly _formBuilder = inject(FormBuilder);
  private readonly _recipeService = inject(RecipeService);
  private readonly _messageService = inject(MessageService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _location = inject(Location);

  ingredients = signal<Ingredients[]>([]);
  urlImage = signal<string | null>(null);
  isEditMode = signal<boolean | null>(false);

  protected categoryOptions = CATEGORIES;
  protected recipe_id!: number;

  protected form: FormGroup = this._formBuilder.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    category: ['', [Validators.required]],
    description: ['', [Validators.required]],
    preparation: ['', [Validators.required]],
  });

  protected formIngredients: FormGroup = this._formBuilder.group({
    ingredient: ['', { validators: [Validators.required] }],
    quantity: ['', [Validators.required]],
    observations: ['', [Validators.required]],
  });

  constructor() {
    const accessType = this._route.snapshot.data['accessType'];
    this.isEditMode.set(accessType === EDIT_MODE)
    if (this.isEditMode()) {
      this._route.paramMap.subscribe((params: any) => {
        this.recipe_id = +params.get('id');
        if (this.recipe_id) {
          this._getRecipeDetail(this.recipe_id);
        }
      });
    }
  }

  addIngredient() {
    if (this.formIngredients.valid) {
      const newIngredient: Ingredients = {
        ingredient_id: crypto.randomUUID(),
        ...this.formIngredients.value,
      };
      this.ingredients.update((elements) => [...elements, newIngredient]);
      this.formIngredients.reset();
    }
  }

  removeIngredient(id: any) {
    this.ingredients.update((elements) =>
      elements.filter((item) => item.ingredient_id!== id)
    );
  }

  onSaveRecipe() {
    if (this.form.valid) {
      this._loadingService.show();
      const formData = new FormData();

      Object.keys(this.form.value).forEach((key) => {
        formData.append(key, this.form.value[key]);
      });

      formData.append(
        'ingredients',
        JSON.stringify(this._removeTemporalId(this.ingredients()))
      );

      if (this.recipe_id) {
        formData.append('recipe_id', JSON.stringify(this.recipe_id));
      }

      if (this.files && this.files.length > 0) {
        this.files.forEach((file: File) => {
          formData.append('files', file);
        });
      }
      if (this.isEditMode()) {
        this._updateRecipe(formData);
      } else {
        this._createRecipe(formData);
      }
    }
  }

  getFiles(event: any) {
    this.files = event;
  }

  onDelete() {
    this._confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar la receta?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this._loadingService.show();
        this._recipeService
          .deleteRecipes(this.recipe_id)
          .pipe(finalize(() => this._loadingService.hide()))
          .subscribe(()=>  this._router.navigate(['search']));
      },
    });
  }

  onReturn() {
    this._location.back();
  }

  private _getRecipeDetail(recipe_id: number) {
    this._loadingService.show();
    this._recipeService
      .getRecipe(recipe_id)
      .pipe(
        finalize(() => {
          this._loadingService.hide();
        })
      )
      .subscribe((result) => {
        this.form.patchValue({ ...result });
        if (result.ingredients) this.ingredients.set(result.ingredients);
        if (result.image_url) this.urlImage.set(result.image_url);
      });
  }

  private _updateRecipe(formData: any) {
    this._recipeService
      .updateRecipes(formData)
      .pipe(finalize(() => this._loadingService.hide()))
      .subscribe((result: any) => {
        this.form.reset();
        this.ingredients.set([]);
        this._showRecipe();
        this._goToDetall(result.recipe.recipe_id);
      });
  }

  private _createRecipe(formData: any) {
    this._recipeService
      .createRecipes(formData)
      .pipe(finalize(() => this._loadingService.hide()))
      .subscribe((result: any) => {
        this.form.reset();
        this.ingredients.set([]);
        this._showRecipe();
        this._goToDetall(result.recipe.recipe_id);
      });
  }

  private _showRecipe() {
    this._messageService.add({
      severity: 'success',
      summary: 'Guardada',
      detail: 'Receta guardada con éxito',
    });
  }

  private _goToDetall(recipe_id: number) {
    this._router.navigate(['detail/' + recipe_id]);
  }

  private _removeTemporalId(ingredients: Ingredients[] | []) {
    return ingredients.map(({ id, ...rest }) => rest);
  }
}
