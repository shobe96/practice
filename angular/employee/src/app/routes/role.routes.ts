import { Routes } from "@angular/router";
import { RoleComponent } from "../roles/ui/role/role.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/data-access/guards/auth.guard";
import { RoleListFacadeService } from "../roles/data-access/role-list.facade.service";

export const roleRoutes: Routes = [
  {
    path: "role",
    component: RoleComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../roles/feature/role-list/role-list.component').then(c => c.RoleListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] },
        providers: [RoleListFacadeService]
      }
    ]
  }
];
