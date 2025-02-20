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
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialog } from 'primeng/confirmdialog';


@NgModule({
    imports: [
        SharedModule,
        ProjectRoutingModule,
        FormsModule,
        AccordionModule,
        ButtonModule,
        TooltipModule,
        TableModule,
        PaginatorModule,
        TabsModule,
        SelectModule,
        MultiSelectModule,
        DatePickerModule,
        InputTextModule,
        DynamicDialogModule,
        ConfirmDialog,
        ProjectComponent,
        ProjectListComponent,
        ProjectEditComponent,
        ProjectDetailsComponent
    ]
})
export class ProjectModule { }
