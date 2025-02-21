import { Routes } from "@angular/router";
import { EmployeeComponent } from "../components/employee/employee.component";
import { authGuard } from "../shared/guards/auth.guard";
import { enumRoles } from "../shared/constants.model";

export const employeeRoutes: Routes = [
  {
    path: "employee",
    component: EmployeeComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../components/employee/employee-list/employee-list.component').then(c => c.EmployeeListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      },
    ]
  }
];
