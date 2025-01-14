import { NgModule } from '@angular/core';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from '../../components/department/department.component';
import { DepartmentListComponent } from '../../components/department/department-list/department-list.component';
import { DepartmentEditComponent } from '../../components/department/department-edit/department-edit.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DepartmentComponent,
    DepartmentListComponent,
    DepartmentEditComponent,
  ],
  imports: [
    DepartmentRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class DepartmentModule { }
