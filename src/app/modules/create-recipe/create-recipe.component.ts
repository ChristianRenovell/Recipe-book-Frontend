import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from '../../core/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  ],
  templateUrl: './create-recipe.component.html',
  providers: [MessageService],
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

  ingredients = signal<Ingredients[]>([]);
  urlImage = signal<string | null>(null);

  protected categoryOptions = CATEGORIES;
  protected accessType!: number;
  protected recipe_id!: number;

  protected form: FormGroup = this._formBuilder.group({
    title: ['', [Validators.required]],
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
    this.accessType = this._route.snapshot.data['accessType'];
    if (this.accessType === EDIT_MODE) {
      this._route.paramMap.subscribe((params: any) => {
        this.recipe_id = +params.get('id');
        if (this.recipe_id) {
          this._getRecipeDetail(this.recipe_id);
        }
      });
    }
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

  addIngredient() {
    if (this.formIngredients.valid) {
      const newIngredient: Ingredients = {
        id: crypto.randomUUID(), // Genera un ID único
        ...this.formIngredients.value,
      };
      this.ingredients.update((elements) => [...elements, newIngredient]);
      this.formIngredients.reset();
    }
  }

  removeIngredient(id: any) {
    this.ingredients.update((elements) =>
      elements.filter((item) => item.id !== id)
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

      if(this.recipe_id) {
        formData.append(
          'recipe_id',
          JSON.stringify(this.recipe_id)
        );
      }

      if (this.files && this.files.length > 0) {
        this.files.forEach((file: File) => {
          formData.append('files', file);
        });
      }
      if (this.accessType === EDIT_MODE) {
        this._updateRecipe(formData)
      } else {
        this._createRecipe(formData)
      }
    }
  }

  private _updateRecipe(formData: any) {
    this._recipeService
      .updateRecipes(formData)
      .pipe(finalize(() => this._loadingService.hide()))
      .subscribe((result: any) => {
        this.form.reset();
        this.ingredients.set([]);
        this._showRecipe();
        this._goToDetall(result.recipe.recipe_id)
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
        this._goToDetall(result.recipe.recipe_id)
      });
  }

  private _showRecipe() {
    this._messageService.add({
      severity: 'success',
      summary: 'Guardada',
      detail: 'Receta guardada con éxito',
    });
  }

  private _goToDetall(recipe_id:number) {
    this._router.navigate(['detail/' + recipe_id]);
  }

  getFiles(event: any) {
    this.files = event;
  }

  private _removeTemporalId(ingredients: Ingredients[] | []) {
    return ingredients.map(({ id, ...rest }) => rest);
  }
}
