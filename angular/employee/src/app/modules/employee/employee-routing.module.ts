import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from '../../components/employee/employee.component';
import { EmployeeEditComponent } from '../../components/employee/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from '../../components/employee/employee-details/employee-details.component';

const routes: Routes = [
  {
    path: "", component: EmployeeComponent, children: [
      { path: "new", component: EmployeeEditComponent },
      { path: "edit/:employeeId", component: EmployeeEditComponent },
      { path: "details/:employeeId", component: EmployeeDetailsComponent },
    ]
  },
  { path: "**", component: EmployeeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
