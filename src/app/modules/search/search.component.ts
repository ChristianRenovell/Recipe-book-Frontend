import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.models';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CardModule, TagModule],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchComponent {
  private readonly _recipeService = inject(RecipeService);

  recipes = signal<Recipe[] | null>(null);

  constructor() {
    this._recipeService.getRecipes().subscribe(this.recipes.set);
  }
}
