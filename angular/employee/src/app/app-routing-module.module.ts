import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './components/department/department.component';
import { BrowserModule } from '@angular/platform-browser';

export const routes: Routes = [
  {
    path: "employee",
    loadChildren: async () => await import("./modules/employee/employee.module").then(m => { m.EmployeeModule; })
    
  },
  { path: 'department', component: DepartmentComponent, children: [] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    BrowserModule
  ]
})
export class AppRoutingModuleModule { }
