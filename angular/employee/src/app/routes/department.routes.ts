import { Routes } from "@angular/router";
import { DepartmentComponent } from "../components/department/department.component";
import { authGuard } from "../shared/guards/auth.guard";
import { enumRoles } from "../shared/constants.model";

export const departmentRoutes: Routes = [
  {
    path: "department",
    component: DepartmentComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../components/department/department-list/department-list.component').then(c => c.DepartmentListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ],
  }
]
