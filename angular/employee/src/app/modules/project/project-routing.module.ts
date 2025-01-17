import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from '../../components/project/project.component';
import { ProjectListComponent } from '../../components/project/project-list/project-list.component';
import { ProjectDetailsComponent } from '../../components/project/project-details/project-details.component';
import { projectResolver } from '../../resolvers/project/project.resolver';

const routes: Routes = [
  {
    path: "", component: ProjectComponent, children: [
      { path: "list", component: ProjectListComponent },
      { path: "details/:projectId", component: ProjectDetailsComponent, resolve: { project: projectResolver } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
