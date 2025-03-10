import { Routes } from "@angular/router";
import { UserComponent } from "../users/ui/user/user.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/guards/auth.guard";

export const userRoutes: Routes = [
  {
    path: "user",
    component: UserComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../users/feature/user-list/user-list.component').then(c => c.UserListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ]
  }
];
