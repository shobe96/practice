import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectDetailsComponent } from '../../components/project/project-details/project-details.component';
import { ProjectEditComponent } from '../../components/project/project-edit/project-edit.component';
import { ProjectListComponent } from '../../components/project/project-list/project-list.component';
import { ProjectComponent } from '../../components/project/project.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ProjectComponent,
    ProjectListComponent,
    ProjectEditComponent,
    ProjectDetailsComponent,
  ],
  imports: [
    SharedModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
