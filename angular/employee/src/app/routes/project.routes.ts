import { Routes } from "@angular/router";
import { ProjectComponent } from "../projects/ui/project/project.component";
import { enumRoles } from "../shared/constants.model";
import { authGuard } from "../shared/data-access/guards/auth.guard";

export const projectRoutes: Routes = [
  {
    path: "project",
    component: ProjectComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../projects/feature/project-list/project-list.component').then(c => c.ProjectListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] },
      },
      {
        path: "details/:projectId",
        loadComponent: () => import('../projects/feature/project-details/project-details.component').then(c => c.ProjectDetailsComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      },
    ]
  }
];
