import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { ADMIN } from './shared/authotities-constants';

const routes: Routes = [
  { path: "employee", loadChildren: () => import("./modules/employee/employee.module").then(m => m.EmployeeModule), canActivate: [authGuard], data: { roles: [ADMIN] } },
  { path: "department", loadChildren: () => import("./modules/department/department.module").then(m => m.DepartmentModule), canActivate: [authGuard], data: { roles: [ADMIN] } },
  { path: "auth", loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule) },
  { path: "user", loadChildren: () => import("./modules/user/user.module").then(m => m.UserModule), canActivate: [authGuard], data: { roles: [ADMIN] } },
  { path: "skill", loadChildren: () => import("./modules/skill/skill.module").then(m => m.SkillModule), canActivate: [authGuard], data: { roles: [ADMIN] } },
  { path: "project", loadChildren: () => import("./modules/project/project.module").then(m => m.ProjectModule), canActivate: [authGuard], data: { roles: [ADMIN] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
