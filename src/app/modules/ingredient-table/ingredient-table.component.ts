import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { Ingredients } from '../../models/recipe.models';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ingredient-table',
  standalone: true,
  imports: [TableModule, ButtonModule],
  templateUrl: './ingredient-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientTableComponent {
  @Input() ingredients!: Ingredients[];
  @Output() removeIngredient = new EventEmitter<string>(); 

  deleteIngredient(idIngredient: string) {
    this.removeIngredient.emit(idIngredient);
  }
}
