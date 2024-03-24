import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from '../../components/department/department.component';
import { DepartmentEditComponent } from '../../components/department/department-edit/department-edit.component';
import { DepartmentDetailsComponent } from '../../components/department/department-details/department-details.component';

const routes: Routes = [
  {
    path: "", component: DepartmentComponent, children: [
      { path: "new", component: DepartmentEditComponent },
      { path: "edit/:departmentId", component: DepartmentEditComponent },
      { path: "details/:departmentId", component: DepartmentDetailsComponent },
    ],
  },
  { path: "**", component: DepartmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
