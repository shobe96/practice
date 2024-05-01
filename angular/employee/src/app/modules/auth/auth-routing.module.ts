import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '../../components/auth/auth.component';
import { AuthFormComponent } from '../../components/auth/auth-form/auth-form.component';
import { authGuard } from '../../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "login",
        component: AuthFormComponent
      },
      {
        path: "register",
        component: AuthFormComponent,
        canActivate: [authGuard],
        data: {roles: ["ADM"]}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
