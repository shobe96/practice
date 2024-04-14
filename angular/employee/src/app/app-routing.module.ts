import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: "employee", loadChildren: () => import("./modules/employee/employee.module").then(m => m.EmployeeModule), canActivate: [authGuard] },
  { path: "department", loadChildren: () => import("./modules/department/department.module").then(m => m.DepartmentModule), canActivate: [authGuard] },
  { path: "auth", loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
