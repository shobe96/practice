import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  private messageService: MessageService = inject(MessageService);
  public employeeSearch: Employee = new Employee();
  public employeeId: number = 0;
  public page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  public employees: Employee[] = [];
  public visible: boolean = false;

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

  public goToDetails(employeeId: number): void {
    this.router.navigate([`employee/details/$${employeeId}`]);
  }

  public goToEdit(employeeId: number): void {
    this.router.navigate([`employee/edit/${employeeId}`]);
  }

  public getAllEmployees(): void {
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

  public addNew(): void {
    this.router.navigate(['employee/new']);
  }

  public onPageChange(event: PaginatorState): void {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    this.retrieveEmployees();
  }

  public showDialog(visible: boolean, employeeId?: number): void {
    this.employeeId = employeeId ?? 0;
    this.visible = visible;
  }

  public delete(): void {
    this.employeeService.delete(this.employeeId).subscribe({
      next: () => {
        this.retrieveEmployees();
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

  private search(): void {
    this.searchSubject.next(this.employeeSearch);
  }

  public onKeyUp(): void {
    this.retrieveEmployees();
  }

  public clear(): void {
    this.employeeSearch = new Employee();
    this.getAllEmployees();
  }

  public refresh(): void {
    this.retrieveEmployees();
  }

  private checkSearchFields(): boolean {
    return Boolean(this.employeeSearch.name ||
      this.employeeSearch.surname ||
      this.employeeSearch.email);
  }

  private retrieveEmployees(): void {
    this.checkSearchFields() ? this.search() : this.getAllEmployees();
  }
}
