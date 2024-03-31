import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from '../../components/employee/employee.component';
import { EmployeeListComponent } from '../../components/employee/employee-list/employee-list.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { TableHoverDirective } from '../../shared/directives/table-hover.directive';
import { EmployeeEditComponent } from '../../components/employee/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from '../../components/employee/employee-details/employee-details.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeListComponent,
    EmployeeEditComponent,
    EmployeeDetailsComponent,
    TableHoverDirective
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class EmployeeModule { }
