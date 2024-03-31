import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentEditComponent } from '../../components/department/department-edit/department-edit.component';
import { DepartmentDetailsComponent } from '../../components/department/department-details/department-details.component';
import { DepartmentListComponent } from '../../components/department/department-list/department-list.component';

const routes: Routes = [
  {
    path: "", component: DepartmentListComponent, children: [
      { path: "new", component: DepartmentEditComponent },
      { path: "edit/:departmentId", component: DepartmentEditComponent },
      { path: "details/:departmentId", component: DepartmentDetailsComponent },
    ],
  },
  { path: "**", component: DepartmentListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
