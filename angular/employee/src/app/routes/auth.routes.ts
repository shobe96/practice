import { Routes } from '@angular/router';
import { AuthComponent } from '../components/auth/auth.component';
import { authGuard } from '../shared/guards/auth.guard';
import { enumRoles } from '../shared/constants.model';


export const authRoutes: Routes = [
  {
    path: "auth",
    component: AuthComponent,
    children: [
      {
        path: "login",
        loadComponent: () => import('../components/auth/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: "register",
        loadComponent: () => import('../components/auth/register/register.component').then(c => c.RegisterComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ]
  }
];
