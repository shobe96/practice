import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthResponse } from '../../../../auth/data-access/auth-response.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (!req.url.includes("login")) {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      const json: AuthResponse = JSON.parse(authResponse);
      const token = json.token ? `Bearer ${json.token}` : ""
      const modifiedReq = req.clone({
        headers: new HttpHeaders().set('Authorization', token)
      });
      return next(modifiedReq);
    }
  }
  return next(req);
};
