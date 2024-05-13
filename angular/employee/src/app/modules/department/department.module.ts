import { NgModule } from '@angular/core';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from '../../components/department/department.component';
import { DepartmentListComponent } from '../../components/department/department-list/department-list.component';
import { DepartmentDetailsComponent } from '../../components/department/department-details/department-details.component';
import { DepartmentEditComponent } from '../../components/department/department-edit/department-edit.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DepartmentComponent,
    DepartmentListComponent,
    DepartmentEditComponent,
    DepartmentDetailsComponent,
  ],
  imports: [
    DepartmentRoutingModule,
    SharedModule
  ]
})
export class DepartmentModule { }
