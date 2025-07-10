import { Routes } from "@angular/router";
import { UserComponent } from "../users/ui/user/user.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/data-access/guards/auth.guard";
import { UserListFacadeService } from "../users/data-access/user-list.facade.service";

export const userRoutes: Routes = [
  {
    path: "user",
    component: UserComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../users/feature/user-list/user-list.component').then(c => c.UserListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] },
        providers: [UserListFacadeService]
      }
    ]
  }
];
