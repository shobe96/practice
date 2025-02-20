import { Routes } from "@angular/router";
import { RoleListComponent } from "../components/role/role-list/role-list.component";
import { RoleComponent } from "../components/role/role.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/guards/auth.guard";

export const roleRoutes: Routes = [
  {
    path: "role",
    component: RoleComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../components/role/role-list/role-list.component').then(c => c.RoleListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ]
  }
];
