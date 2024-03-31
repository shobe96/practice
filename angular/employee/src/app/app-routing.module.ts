import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "employee", loadChildren: () => import("./modules/employee/employee.module").then(m => m.EmployeeModule) },
  { path: "department", loadChildren: () => import("./modules/department/department.module").then(m => m.DepartmentModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
