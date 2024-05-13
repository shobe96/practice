import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: "employee", loadChildren: () => import("./modules/employee/employee.module").then(m => m.EmployeeModule), canActivate: [authGuard], data: { roles: ["ADM"] } },
  { path: "department", loadChildren: () => import("./modules/department/department.module").then(m => m.DepartmentModule), canActivate: [authGuard], data: { roles: ["ADM"] } },
  { path: "auth", loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule) },
  { path: "user", loadChildren: () => import("./modules/user/user.module").then(m => m.UserModule), canActivate: [authGuard], data: { roles: ["ADM"] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
