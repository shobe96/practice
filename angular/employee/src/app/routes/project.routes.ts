import { Routes } from "@angular/router";
import { ProjectComponent } from "../components/project/project.component";
import { authGuard } from "../shared/guards/auth.guard";
import { enumRoles } from "../shared/constants.model";

export const projectRoutes: Routes = [
  {
    path: "project",
    component: ProjectComponent,
    children: [
      {
        path: "list",
        loadComponent: () => import('../components/project/project-list/project-list.component').then(c => c.ProjectListComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] },
      },
      {
        path: "details/:projectId",
        loadComponent: () => import('../components/project/project-details/project-details.component').then(c => c.ProjectDetailsComponent),
        canActivate: [authGuard],
        data: { roles: [enumRoles.ADMIN] }
      },
    ]
  }
];
