import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private _http = inject(HttpClient);
  private readonly URI = environment.apiUrl;

  createRecipes(body: any): Observable<any> {
    return this._http.post<any>(environment.apiUrl + '/recipe', body);
  }

  getRecipes(id: any): Observable<any> {
    return this._http.get<any>(environment.apiUrl + '/get-by-recipe-id/' + id);
  }
}
