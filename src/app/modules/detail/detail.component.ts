import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { RecipeService } from '../../services/recipe.service';
import { LoadingService } from '../../core/services/loading.service';
import { finalize } from 'rxjs/operators';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { Ingredients, Recipe } from '../../models/recipe.models';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CardModule, ImageModule, TableModule],
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DetailComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _recipeService = inject(RecipeService);
  private readonly _loadingService = inject(LoadingService);

  recipe_id = signal<string | null>(null);
  recipe = signal<Recipe | null>(null);
  ingredients = signal<Ingredients[]>([]);

  constructor() {
    this._route.paramMap.subscribe((params: any) => {
      const recipe_id = +params.get('id');
      this._getRecipeDetail(recipe_id);
    });
  }

  private _getRecipeDetail(recipe_id: number) {
    this._loadingService.show();
    this._recipeService
      .getRecipe(recipe_id)
      .pipe(finalize(() => this._loadingService.hide()))
      .subscribe((result) => {
        this.recipe.set(result);
        if (result.ingredients) this.ingredients.set(result.ingredients);
      });
  }
}
