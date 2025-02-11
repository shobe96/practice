import { NgModule } from '@angular/core';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from '../../components/department/department.component';
import { DepartmentListComponent } from '../../components/department/department-list/department-list.component';
import { DepartmentEditComponent } from '../../components/department/department-edit/department-edit.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    DepartmentComponent,
    DepartmentListComponent,
    DepartmentEditComponent,
  ],
  imports: [
    DepartmentRoutingModule,
    SharedModule,
    FormsModule,
    AccordionModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    PaginatorModule,
    DialogModule,
    ToastModule,
    InputTextModule,
  ]
})
export class DepartmentModule { }
