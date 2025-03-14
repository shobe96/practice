import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthFacadeService } from '../../../../auth/data-access/auth.facade.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authFacade = inject(AuthFacadeService);

  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      authFacade.logout();
    }
    return throwError(() => error);
  }));
};
