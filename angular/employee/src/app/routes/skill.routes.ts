import { Routes } from "@angular/router";
import { SkillComponent } from "../skills/ui/skill/skill.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/data-access/guards/auth.guard";

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
