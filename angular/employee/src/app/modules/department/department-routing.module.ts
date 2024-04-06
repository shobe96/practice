import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentEditComponent } from '../../components/department/department-edit/department-edit.component';
import { DepartmentDetailsComponent } from '../../components/department/department-details/department-details.component';
import { DepartmentListComponent } from '../../components/department/department-list/department-list.component';
import { DepartmentComponent } from '../../components/department/department.component';
import { departmentResolver } from '../../resolvers/department/department.resolver';

const routes: Routes = [
  {
    path: "", component: DepartmentComponent, children: [
      { path: "list", component: DepartmentListComponent },
      { path: "new", component: DepartmentEditComponent },
      { path: "edit/:departmentId", component: DepartmentEditComponent },
      { path: "details/:departmentId", component: DepartmentDetailsComponent, resolve: { department: departmentResolver } },
    ],
  },
  { path: "**", component: DepartmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
