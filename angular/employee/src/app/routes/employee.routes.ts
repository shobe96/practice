import { Routes } from "@angular/router";
import { EmployeeComponent } from "../employees/ui/employee/employee.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/data-access/guards/auth.guard";
import { EmployeeListFacadeService } from "../employees/data-access/employee-list.facade.service";

export const employeeRoutes: Routes = [
  {
    path: "employee",
    component: EmployeeComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../employees/feature/employee-list/employee-list.component').then(c => c.EmployeeListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] },
        providers: [EmployeeListFacadeService]
      },
    ]
  }
];
