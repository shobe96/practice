import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthRequest } from '../../models/auth-request.model';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/auth";
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  public login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post(`${this.backendURL}${this.baseUrl}/login`, request);
  }

  logout() {
    localStorage.removeItem("authResponse");
    this.router.navigate(['/auth/login']);
    clearTimeout(this.tokenExpirationTimer);
  }

  autoLogout(expiration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiration);
  }
}
