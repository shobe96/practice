import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthResponse } from '../../../auth/data-access/auth-response.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authResponse = localStorage.getItem('authResponse');
  if (authResponse) {
    const json: AuthResponse = JSON.parse(authResponse);
    const userRoles = json.roles ?? [];
    const roles: string[] = route.data['roles'] ?? [];
    for (const userRole of userRoles) {
      for (const role of roles) {
        if (userRole.code === role) {
          return true;
        }
      }
    }
    return false;
  } else {
    const router = inject(Router);
    router.navigate([`/auth/login`], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
