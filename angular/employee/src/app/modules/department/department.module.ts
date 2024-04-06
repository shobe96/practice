import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from '../../components/department/department.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { DepartmentListComponent } from '../../components/department/department-list/department-list.component';
import { DepartmentDetailsComponent } from '../../components/department/department-details/department-details.component';
import { DepartmentEditComponent } from '../../components/department/department-edit/department-edit.component';
import { TableHoverDirective } from '../../shared/directives/table-hover.directive';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DepartmentComponent,
    DepartmentListComponent,
    DepartmentEditComponent,
    DepartmentDetailsComponent,
  ],
  imports: [
    // CommonModule,
    DepartmentRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DepartmentModule { }
