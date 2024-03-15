import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeEditComponent } from '../../components/employee/employee-edit/employee-edit.component';
import { Routes, RouterModule, RouterOutlet } from '@angular/router';
import { EmployeeDetailsComponent } from '../../components/employee/employee-details/employee-details.component';
import { EmployeeComponent } from '../../components/employee/employee.component';

export const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      { path: 'new', component: EmployeeEditComponent },
      { path: 'edit/:employeeId', component: EmployeeEditComponent },
      { path: 'details/:employeeId', component: EmployeeDetailsComponent },
    ],
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class EmployeeModule { }
