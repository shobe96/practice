import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Employee } from '../../../models/employee.model';
import { Subscription } from 'rxjs';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { PageEvent } from '../../../models/page-event.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  private employees$!: Subscription;
  private employeesCount$!: Subscription;
  employeeId: number = 0;
  page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0
  }
  employees: Employee[] = [];
  items: MenuItem[] = [];
  visible: boolean = false;
  countObserver: any = {
    next: (value: number) => {
      this.page.pageCount = value;
    },
    error: (err: any) => { console.log(err) },
    complete: () => { }
  }

  constructor(private employeeService: EmployeeService, private router: Router) { }

  goToDetails(employeeId: number) { this.router.navigate([`employee/details/$${employeeId}`]); }
  goToEdit(employeeId: number) { this.router.navigate([`employee/edit/${employeeId}`]); }
  ngOnInit(): void {
    this.employeesCount$ = this.employeeService.getEmployeeCount().subscribe(this.countObserver);
    this.getAllEmpoloyees();
  }
  ngOnDestroy(): void {
    this.employees$.unsubscribe();
    this.employeesCount$.unsubscribe();
  }

  public getAllEmpoloyees() {
    const employeesObserver: any = {
      next: (value: Employee[]) => {
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
    this.employees$ = this.employeeService.getAllEmpoloyees(this.page).subscribe(employeesObserver);
  }

  public addNew() {
    this.router.navigate(["employee/new"]);
  }

  setId(employeeId: number) {
    this.employeeId = employeeId;
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first !== undefined ? event.first : 0;
    this.page.page = event.page !== undefined ? event.page : 0;
    this.page.rows = event.rows !== undefined ? event.rows : 0;
    this.getAllEmpoloyees();
  }

  showDialog(visible: boolean, employeeId?: number) {
    this.employeeId = employeeId === undefined ? 0 : employeeId;
    this.visible = visible;
  }

  delete() {
    this.employeeService.delete(this.employeeId).subscribe({
      next: (value) => {
        this.employeesCount$ = this.employeeService.getEmployeeCount().subscribe(this.countObserver);
        this.getAllEmpoloyees();
        this.showDialog(false)
      },
      error: (err) => { console.log(err) },
      complete: () => { console.log("Completed") }
    });
  }

}
