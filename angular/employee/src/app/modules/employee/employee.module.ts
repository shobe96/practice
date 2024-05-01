import { NgModule } from '@angular/core';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from '../../components/employee/employee.component';
import { EmployeeListComponent } from '../../components/employee/employee-list/employee-list.component';
import { EmployeeEditComponent } from '../../components/employee/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from '../../components/employee/employee-details/employee-details.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeListComponent,
    EmployeeEditComponent,
    EmployeeDetailsComponent
  ],
  imports: [
    EmployeeRoutingModule,
    SharedModule
  ]
})
export class EmployeeModule { }
