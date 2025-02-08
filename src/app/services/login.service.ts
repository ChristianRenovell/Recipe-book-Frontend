import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../user.interface';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _http = inject(HttpClient);

  login(token: string): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(environment.apiUrl + '/login', {
      token: token,
    });
  }

  test() {
    return this._http.get<LoginResponse>(environment.apiUrl + '/test');
  }
}
