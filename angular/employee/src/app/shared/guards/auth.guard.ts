import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthResponse } from '../../models/auth-response.model';
import { Role } from '../../models/role.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authResponse = localStorage.getItem('authResponse');
  if (authResponse !== null) {
    const json: AuthResponse = JSON.parse(authResponse);
    const userRoles: Role[] = json.roles ?? [];
    const roles: string[] = route.data['roles'] ?? [];
    for (let userRole of userRoles) {
      for (let role of roles) {
        if (userRole.code === role) {
          return true;
        }
      }
    }
    return false;
  } else {
    const router = inject(Router);
    router.navigate([`/auth/login`]);
    return false;
  }
};
