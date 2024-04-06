import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Employee } from '../../../models/employee.model';
import { Subject, Subscription, debounceTime, of } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { PageEvent } from '../../../models/page-event.model';
import { EmpoyeeSearchResult } from '../../../models/empoyee-search-result.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  private employees$!: Subscription;
  private searchSubject = new Subject<Employee>();
  employeeSearch: Employee = new Employee();
  employeeId: number = 0;
  page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: "asc"
  }
  employees: Employee[] = [];
  visible: boolean = false;

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.getAllEmpoloyees();
    this.searchSubject.pipe(debounceTime(2000)).subscribe({
      next: (value) => {
        this.employeeService.search(value, this.page).subscribe({
          next: (value) => {
            this.employees = value.employees ?? [];
            this.page.pageCount = value.size ?? 0;
          },
          error: (err) => {
            console.log(err);
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.employees$.unsubscribe();
    this.searchSubject.complete();
  }

  goToDetails(employeeId: number) {
    this.router.navigate([`employee/details/$${employeeId}`]);
  }

  goToEdit(employeeId: number) {
    this.router.navigate([`employee/edit/${employeeId}`]);
  }

  public getAllEmpoloyees() {
    const employeesObserver: any = {
      next: (value: EmpoyeeSearchResult) => {
        this.employees = value.employees !== undefined ? value.employees : [];
        this.page.pageCount = value.size !== undefined ? value.size : 0;
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
    if (this.employeeSearch.name !== "" || this.employeeSearch.surname !== "" || this.employeeSearch.email !== "") {
      this.search();
    } else {
      this.getAllEmpoloyees();
    }
  }

  showDialog(visible: boolean, employeeId?: number) {
    this.employeeId = employeeId === undefined ? 0 : employeeId;
    this.visible = visible;
  }

  delete() {
    this.employeeService.delete(this.employeeId).subscribe({
      next: (value: any) => {
        if (this.employeeSearch.name !== "" || this.employeeSearch.surname !== "" || this.employeeSearch.email !== "") {
          this.search();
        } else {
          this.getAllEmpoloyees();
        }
        this.showDialog(false)
      },
      error: (err: any) => { console.log(err) },
      complete: () => { console.log("Completed") }
    });
  }

  search() {
    this.searchSubject.next(this.employeeSearch);
  }

  clear() {
    this.employeeSearch = new Employee();
    this.getAllEmpoloyees();
  }
}
