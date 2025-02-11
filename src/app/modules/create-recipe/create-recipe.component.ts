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
  ],
  templateUrl: './create-recipe.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateRecipeComponent {
  form!: FormGroup;
  formIngredients!: FormGroup;

  formBuilder = inject(FormBuilder);

  ingredients = signal<Ingredients[]>([]);

  constructor() {
    this.form = this.formBuilder.group({
      title: ['', { validators: [Validators.required] }],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      preparation: ['', [Validators.required]],
    });

    this.formIngredients = this.formBuilder.group({
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
}
