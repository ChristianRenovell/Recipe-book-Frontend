import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Recipe, RecipeFilter } from '../models/recipe.models';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private _http = inject(HttpClient);
  private readonly URI = environment.apiUrl;

  createRecipes(body: any) {
    return this._http.post(environment.apiUrl + '/recipe', body);
  }

  updateRecipes(body: any) {
    return this._http.put(environment.apiUrl + '/recipe', body);
  }

  deleteRecipes(recipe_id: any) {
    return this._http.delete(environment.apiUrl + '/recipe/' + recipe_id);
  }

  getRecipe(id: number): Observable<Recipe> {
    return this._http.get<Recipe>(environment.apiUrl + '/recipe/get-by-recipe-id/' + id);
  }

  getRecipes(): Observable<Recipe[]> {
    return this._http.get<Recipe[]>(environment.apiUrl + '/recipe/get-all');
  }

  searchRecipes(body: RecipeFilter): Observable<Recipe[]> {
    return this._http.post<Recipe[]>(environment.apiUrl + '/recipe/filter', body);
  }
}
