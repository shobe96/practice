import { Routes } from "@angular/router";
import { DepartmentComponent } from "../departments/ui/department/department.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/data-access/guards/auth.guard";

export const departmentRoutes: Routes = [
  {
    path: "department",
    component: DepartmentComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../departments/feature/department-list/department-list.component').then(c => c.DepartmentListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ],
  }
]
