import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit, OnDestroy {
  employees$: any;
  employees: Employee[] = [];
  employeesObserver: any = {
    next: (value: any) => {
      console.log(value);
      this.employees = value;
    },
    error: (err: any) => {
      console.log(err);
    },
    complete: () => {
      console.log('Completed');
    },
  };
  constructor(private employeeService: EmployeeService) {}
  ngOnDestroy(): void {
    this.employees$.unsubscribe;
  }
  ngOnInit(): void {
    this.getAllEmpoloyees();
    this.employees$.subscribe(this.employeesObserver);
  }

  public getAllEmpoloyees() {
    this.employees$ = this.employeeService.getAllEmpoloyees();
  }
}
