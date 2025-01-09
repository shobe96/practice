import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from '../../components/department/department-list/department-list.component';
import { DepartmentComponent } from '../../components/department/department.component';

const routes: Routes = [
  {
    path: "", component: DepartmentComponent, children: [
      { path: "list", component: DepartmentListComponent }
    ],
  },
  { path: "**", component: DepartmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
