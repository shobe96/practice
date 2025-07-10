import { Routes } from "@angular/router";
import { HomeComponent } from "../home/feature/home/home.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/data-access/guards/auth.guard";
import { HomeFacadeService } from "../home/data-access/home.facade.service";

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
    ],
    providers: [HomeFacadeService]
  }
]
