import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthRequest } from '../../models/auth-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models/register-request.model';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { ADMIN } from '../../shared/authotities-constants';
import { Role } from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/auth";
  private http: HttpClient = inject(HttpClient);

  public login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post(`${this.backendURL}${this.baseUrl}/login`, request);
  }

  public registerUser(request: RegisterRequest): Observable<string> {
    return this.http.post<string>(`${this.backendURL}${this.baseUrl}/register-user`, request);
  }



  public delete(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${userId}`);
  }
}
