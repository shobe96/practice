import { Routes } from "@angular/router";
import { HomeComponent } from "../home/feature/home/home.component";
import { authGuard } from "../shared/guards/auth.guard";
import { enumRoles } from "../shared/constants.model";

export const homeRoutes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    children: [
      {
        path: "panel",
        loadComponent: () => import('../home/ui/home-panel/home-panel.component').then(c => c.HomePanelComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN, enumRoles.EMPLOYEE, enumRoles.DEPARTMENT_CHIEF] }
      }
    ]
  }
]
