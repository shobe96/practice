import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { AuthResponse } from '../../../models/auth-response.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req.headers);
  if (!req.url.includes("login")) {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse !== null) {
      let json: AuthResponse = {};
      json = JSON.parse(authResponse);
      const modifiedReq = req.clone({
        params: new HttpParams().set(`token`, json.token ?? "")
      });
      return next(modifiedReq);
    }
  }
  return next(req);
};
