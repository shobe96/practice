import { NgModule } from '@angular/core';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectDetailsComponent } from '../../components/project/project-details/project-details.component';
import { ProjectEditComponent } from '../../components/project/project-edit/project-edit.component';
import { ProjectListComponent } from '../../components/project/project-list/project-list.component';
import { ProjectComponent } from '../../components/project/project.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    ProjectComponent,
    ProjectListComponent,
    ProjectEditComponent,
    ProjectDetailsComponent,
  ],
  imports: [
    SharedModule,
    ProjectRoutingModule,
    FormsModule,
    AccordionModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    PaginatorModule,
    DialogModule,
    TabsModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    InputTextModule,
  ]
})
export class ProjectModule { }
