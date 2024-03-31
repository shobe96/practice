import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeEditComponent } from '../../components/employee/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from '../../components/employee/employee-details/employee-details.component';
import { EmployeeListComponent } from '../../components/employee/employee-list/employee-list.component';
import { EmployeeComponent } from '../../components/employee/employee.component';
import { employeeResolver } from '../../resolvers/employee/employee.resolver';

const routes: Routes = [
  {
    path: "", component: EmployeeComponent, children: [
      { path: "list", component: EmployeeListComponent },
      { path: "new", component: EmployeeEditComponent },
      { path: "edit/:employeeId", component: EmployeeEditComponent },
      { path: "details/:employeeId", component: EmployeeDetailsComponent, resolve: { employee: employeeResolver } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
