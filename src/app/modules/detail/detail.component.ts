import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { RecipeService } from '../../services/recipe.service';
import { LoadingService } from '../../core/services/loading.service';
import { finalize } from 'rxjs/operators';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { Ingredients, Recipe, Step } from '../../models/recipe.models';
import { CATEGORIES } from '../../constants/categories';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CardModule, ImageModule, TableModule, TagModule, ButtonModule],
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DetailComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _recipeService = inject(RecipeService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _router = inject(Router);

  protected readonly CATEGORIES = CATEGORIES;

  protected recipe_id!:number;
  recipe = signal<Recipe | null>(null);
  ingredients = signal<Ingredients[]>([]);
  steps = signal<Step[]>([]);
  isLoading = signal<boolean>(true);
  isAdmin = signal<boolean>(false)
  
  constructor() {
    this._route.paramMap.subscribe((params: any) => {
      this.recipe_id = +params.get('id');
      this._getRecipeDetail(this.recipe_id);
    });
    this._checkIsAdmin()
  }

  private _checkIsAdmin() {
    const token = localStorage.getItem('token-recipes');
    this.isAdmin.set(!!token)
  }

  private _getRecipeDetail(recipe_id: number) {
    this._loadingService.show();
    this._recipeService
      .getRecipe(recipe_id)
      .pipe(
        finalize(() => {
          this._loadingService.hide();
          this.isLoading.set(false);
        })
      )
      .subscribe((result) => {
        this.recipe.set(result);
        if (result.ingredients) this.ingredients.set(result.ingredients);
        if (result.steps) this.steps.set(result.steps);

      });
  }

  getCategorySeverrity(
    category: number
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severity = CATEGORIES.find(
      (element) => element.id === category
    )?.severity;
    return !!severity ? severity : 'success';
  }

  getCategoryName(category: number): string {
    const severity = CATEGORIES.find(
      (element) => element.id === category
    )?.name;
    return !!severity ? severity : '';
  }
  
  
  onReturn() {
    this._router.navigate(['search']);
  }

  onGoToEdit() {
    this._router.navigate(['edit/' + this.recipe_id ]);
  }
}
