import { Routes } from "@angular/router";
import { HomeComponent } from "../components/home/home.component";
import { authGuard } from "../shared/guards/auth.guard";
import { enumRoles } from "../shared/constants.model";

export const homeRoutes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    children: [
      {
        path: "panel",
        loadComponent: () => import('../components/home/home-panel/home-panel.component').then(c => c.HomePanelComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN, enumRoles.EMPLOYEE, enumRoles.DEPARTMENT_CHIEF] }
      }
    ]
  }
]
