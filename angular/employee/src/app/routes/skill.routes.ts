import { Routes } from "@angular/router";
import { SkillComponent } from "../components/skill/skill.component";
import { authGuard } from "../shared/guards/auth.guard";
import { enumRoles } from "../shared/constants.model";

export const skillRoutes: Routes = [
  {
    path: "skill",
    component: SkillComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../components/skill/skill-list/skill-list.component').then(c => c.SkillListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ]
  },
];
