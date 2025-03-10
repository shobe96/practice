import { Routes } from '@angular/router';
import { AuthComponent } from '../auth/ui/auth.component';
import { authGuard } from '../shared/guards/auth.guard';
import { enumRoles } from '../shared/constants.model';


export const authRoutes: Routes = [
  {
    path: "auth",
    component: AuthComponent,
    children: [
      {
        path: "login",
        loadComponent: () => import('../auth/feature/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: "register",
        loadComponent: () => import('../auth/feature/register/register.component').then(c => c.RegisterComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ]
  }
];
