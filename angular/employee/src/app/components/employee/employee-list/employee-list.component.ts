import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Employee } from '../../../models/employee.model';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { PageEvent } from '../../../models/page-event.model';
import { EmployeeSearchResult } from '../../../models/employee-search-result.model';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
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
    sort: 'asc',
  };
  employees: Employee[] = [];
  visible: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAllEmployees();
    this.searchSubject.pipe(debounceTime(2000)).subscribe({
      next: (value) => {
        this.employeeService.search(value, this.page).subscribe({
          next: (value) => {
            this.employees = value.employees ?? [];
            this.page.pageCount = value.size ?? 0;
          },
          error: (err) => {
            fireToast('error', 'Error', err.error.message, this.messageService);
          },
        });
      },
      error: (err) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
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

  public getAllEmployees() {
    const employeesObserver: any = {
      next: (value: EmployeeSearchResult) => {
        this.employees = value.employees ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.message, this.messageService);
      },
      complete: () => {
        console.log('Completed');
      },
    };
    this.employees$ = this.employeeService
      .getAllEmployees(false, this.page)
      .subscribe(employeesObserver);
  }

  public addNew() {
    this.router.navigate(['employee/new']);
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    if (
      (this.employeeSearch.name !== undefined &&
        this.employeeSearch.name !== '') ||
      (this.employeeSearch.surname !== undefined &&
        this.employeeSearch.surname !== '') ||
      (this.employeeSearch.email !== undefined &&
        this.employeeSearch.surname !== '')
    ) {
      this.search();
    } else {
      this.getAllEmployees();
    }
  }

  showDialog(visible: boolean, employeeId?: number) {
    this.employeeId = employeeId ?? 0;
    this.visible = visible;
  }

  delete() {
    this.employeeService.delete(this.employeeId).subscribe({
      next: (value: any) => {
        if (
          (this.employeeSearch.name !== undefined &&
            this.employeeSearch.name !== '') ||
          (this.employeeSearch.surname !== undefined &&
            this.employeeSearch.surname !== '') ||
          (this.employeeSearch.email !== undefined &&
            this.employeeSearch.surname !== '')
        ) {
          this.search();
        } else {
          this.getAllEmployees();
        }
        fireToast(
          'success',
          'success',
          `Employee with id ${this.employeeId} has been deleted.`,
          this.messageService
        );
        this.showDialog(false);
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  search() {
    console.log(this.employeeSearch);
    this.searchSubject.next(this.employeeSearch);
  }

  onKeyUp() {
    if (
      (this.employeeSearch.name !== undefined &&
        this.employeeSearch.name !== '') ||
      (this.employeeSearch.surname !== undefined &&
        this.employeeSearch.surname !== '') ||
      (this.employeeSearch.email !== undefined &&
        this.employeeSearch.email !== '')
    ) {
      this.search();
    } else {
      this.getAllEmployees();
    }
  }

  public clear() {
    this.employeeSearch = new Employee();
    this.getAllEmployees();
  }

  public refresh() {
    if (
      (this.employeeSearch.name !== undefined &&
        this.employeeSearch.name !== '') ||
      (this.employeeSearch.surname !== undefined &&
        this.employeeSearch.surname !== '') ||
      (this.employeeSearch.email !== undefined &&
        this.employeeSearch.surname !== '')
    ) {
      this.search();
    } else {
      this.getAllEmployees();
    }
  }
}
