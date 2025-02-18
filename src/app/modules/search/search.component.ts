import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { RecipeService } from '../../services/recipe.service';
import {
  CategoryModel,
  Recipe,
  RecipeFilter,
} from '../../models/recipe.models';
import { TagModule } from 'primeng/tag';
import { CATEGORIES } from '../../constants/categories';
import { finalize } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CardModule,
    TagModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchComponent {
  private readonly _recipeService = inject(RecipeService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _fb = inject(FormBuilder);

  recipes = signal<Recipe[] | null>(null);

  protected filterForm = this._fb.group({
    author: ['' as string | null],
    category: [null as number | null],
    title: ['' as string | null],
  });

  protected readonly CATEGORIES = CATEGORIES;

  constructor() {
    this._getRecipes();
  }

  private _getRecipes() {
    this._loadingService.show();
    this._recipeService
      .getRecipes()
      .pipe(finalize(() => this._loadingService.hide()))
      .subscribe(this.recipes.set);
  }

  onSearch() {
    this._loadingService.show();
    const body: RecipeFilter = this.filterForm.value;
    this._recipeService
      .searchRecipes(body)
      .pipe(finalize(() => this._loadingService.hide()))
      .subscribe(this.recipes.set);
  }

  getCategorySeverrity(
    category: number
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severity = CATEGORIES.find(
      (element) => element.id === category
    )?.severity;
    return !!severity ? severity : 'success';
  }
}
