import { Routes } from "@angular/router";
import { SkillComponent } from "../skills/ui/skill/skill.component";
import { authGuard } from "../shared/guards/auth.guard";
import { enumRoles } from "../shared/constants.model";

export const skillRoutes: Routes = [
  {
    path: "skill",
    component: SkillComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../skills/feature/skill-list/skill-list.component').then(c => c.SkillListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      }
    ]
  },
];
