import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Recipe } from '../models/recipe.models';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private _http = inject(HttpClient);
  private readonly URI = environment.apiUrl;

  createRecipes(body: any): Observable<any> {
    return this._http.post<any>(environment.apiUrl + '/recipe', body);
  }

  getRecipe(id: any): Observable<any> {
    return this._http.get<any>(environment.apiUrl + '/recipe/get-by-recipe-id/' + id);
  }

  getRecipes(): Observable<Recipe[]> {
    return this._http.get<Recipe[]>(environment.apiUrl + '/recipe/get-all');
  }
}
