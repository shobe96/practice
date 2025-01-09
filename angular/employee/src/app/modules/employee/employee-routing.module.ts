import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from '../../components/employee/employee-list/employee-list.component';
import { EmployeeComponent } from '../../components/employee/employee.component';

const routes: Routes = [
  {
    path: "", component: EmployeeComponent, children: [
      { path: "list", component: EmployeeListComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
