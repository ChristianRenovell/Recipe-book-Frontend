import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { CATEGORIES } from '../../constants/categories';
import { UploadComponent } from '../upload/upload.component';
import { RecipeService } from '../../services/recipe.service';
import { finalize } from 'rxjs';

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
  ],
  templateUrl: './create-recipe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateRecipeComponent {
  form!: FormGroup;
  formIngredients!: FormGroup;
  files: any = [];

  private readonly _formBuilder = inject(FormBuilder);
  private readonly _recipeService = inject(RecipeService);

  ingredients = signal<Ingredients[]>([]);
  categoryOptions = CATEGORIES;

  constructor() {
    this.form = this._formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      preparation: ['', [Validators.required]],
    });

    this.formIngredients = this._formBuilder.group({
      ingredient: ['', { validators: [Validators.required] }],
      quantity: ['', [Validators.required]],
      observations: ['', [Validators.required]],
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

  saveRecipe() {
    if (this.form.valid) {
      const formData = new FormData();
  
      Object.keys(this.form.value).forEach((key) => {
        formData.append(key, this.form.value[key]);
      });
  
      formData.append('ingredients', JSON.stringify(this._removeTemporalId(this.ingredients())));
  
      console.log('Archivos antes de enviarlos:', this.files); // Verifica si hay archivos
  
      if (this.files && this.files.length > 0) {
        this.files.forEach((file: File) => {
          formData.append('files', file); 
        });
      }
  
      this._recipeService
        .createRecipes(formData)
        .pipe(finalize(() => alert('Terminé')))
        .subscribe(() => this.form.reset());
    }
  }
  
  

  getFiles(event: any) {
    this.files = event;
  }

  private _removeTemporalId(ingredients: Ingredients[] | []) {
    return ingredients.map(({ id, ...rest }) => rest);
  }
}
