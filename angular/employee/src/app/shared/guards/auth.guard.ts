import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let authResponse = localStorage.getItem('authResponse');
  if (authResponse !== null) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate([`/auth/login`]);
    return false;
  }
};
