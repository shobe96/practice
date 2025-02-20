import { Routes } from "@angular/router";
import { UserListComponent } from "../components/user/user-list/user-list.component";
import { UserComponent } from "../components/user/user.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/guards/auth.guard";

export const userRoutes: Routes = [
  {
    path: "user",
    component: UserComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../components/user/user-list/user-list.component').then(c => c.UserListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ]
  }
];
