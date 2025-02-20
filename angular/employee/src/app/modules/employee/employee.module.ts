import { NgModule } from '@angular/core';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from '../../components/employee/employee.component';
import { EmployeeListComponent } from '../../components/employee/employee-list/employee-list.component';
import { EmployeeEditComponent } from '../../components/employee/employee-edit/employee-edit.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeListComponent,
    EmployeeEditComponent
  ],
  imports: [
    EmployeeRoutingModule,
    SharedModule,
    FormsModule,
    AccordionModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    PaginatorModule,
    SelectModule,
    MultiSelectModule,
    ToastModule,
    InputTextModule,
    DynamicDialogModule,
    ConfirmDialogModule
  ]
})
export class EmployeeModule { }
