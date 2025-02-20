import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthRequest } from '../../models/auth-request.model';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import { RegisterRequest } from '../../models/register-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/auth";
  private _http: HttpClient = inject(HttpClient);

  login(request: AuthRequest): Observable<AuthResponse> {
    return this._http.post(`${this._backendURL}${this._baseUrl}/login`, request);
  }

  registerUser(request: RegisterRequest): Observable<string> {
    return this._http.post<string>(`${this._backendURL}${this._baseUrl}/register-user`, request);
  }

  delete(userId: number): Observable<void> {
    return this._http.delete<void>(`${this._backendURL}${this._baseUrl}/delete/${userId}`);
  }
}
