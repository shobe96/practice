import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthFacadeService } from '../../../../auth/data-access/auth.facade.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // const authFacade = inject(AuthFacadeService);
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log("ERROR");
        // 2. Inject it HERE, only when a 401 actually happens
        const authFacade = injector.get(AuthFacadeService);
        authFacade.logout();
      }
      return throwError(() => error);
    })
  );
};
