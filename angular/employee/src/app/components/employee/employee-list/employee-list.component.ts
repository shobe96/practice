import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Employee } from '../../../models/employee.model';
import { Observable, Subject, debounceTime, switchMap, takeUntil } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { PageEvent } from '../../../models/page-event.model';
import { EmployeeSearchResult } from '../../../models/employee-search-result.model';
import { MessageService } from 'primeng/api';
import { fireToast } from '../../../shared/utils';
import { CrudOperations } from '../../../shared/crud-operations';
import { SubscriptionCleaner } from '../../../shared/subscription-cleaner ';
import { EmployeeListFacadeService } from '../../../services/employee/employee-list.facade.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  standalone: false
})
export class EmployeeListComponent extends SubscriptionCleaner implements OnInit, OnDestroy, CrudOperations {
  private searchSubject = new Subject<Employee>();
  private employeeService: EmployeeService = inject(EmployeeService);
  private messageService: MessageService = inject(MessageService);
  public employeeSearch: Employee = {};
  public employeeId: number | null = 0;
  public page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  public employees: Employee[] = [];
  public visible: boolean = false;
  public editVisible: boolean = false;
  public modalTitle: string = '';
  public disable: boolean = false;
  public employees$!: Observable<Employee[]>;
  public size$!: Observable<number>;
  public employeeResponse$!: Observable<EmployeeSearchResult>;
  public employeeListFacade: EmployeeListFacadeService = inject(EmployeeListFacadeService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.employeeListFacade.getAll(false, this.page);
    this.searchSubject
      .pipe(
        debounceTime(2000),
        takeUntil(this.componentIsDestroyed$)
      ).subscribe({
        next: (value: Employee) => {

        },
        error: (err) => {
          fireToast('error', 'Error', err.error.message, this.messageService);
        },
        complete: () => { }
      });
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  public addNew(): void {
    this.goToEdit(null);
  }

  public checkSearchFields(): boolean {
    return Boolean(this.employeeSearch.name ||
      this.employeeSearch.surname ||
      this.employeeSearch.email);
  }

  public clear(): void {
    this.employeeSearch = {};
    this.getAll();
  }

  public delete(): void {
    if (this.employeeId) {
      this.employeeService.delete(this.employeeId).pipe(takeUntil(this.componentIsDestroyed$)).subscribe({
        next: () => {
          this.retrieve();
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

        },
      });
    }
  }

  public getAll(): void {
    const employeesObserver: any = {
      next: (value: EmployeeSearchResult) => {
        this.employees = value.employees ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.message, this.messageService);
      },
      complete: () => { },
    };
    this.employeeService.getAllEmployees(false, this.page);
    this.employeeResponse$ = this.employeeService.getEmployeeResponse();
  }

  public goToDetails(id: number): void {
    this.setEditParams(true, id, `Employee ${id}`, true);
  }

  public goToEdit(id: number | null): void {
    const title = id ? `Employee ${id}` : 'Add new Employee'
    this.setEditParams(true, id, title, false);
  }

  public handleCancel(event: any): void {
    this.editVisible = event.visible;
    if (event.save) {
      this.refresh();
    }
  }

  public onKeyUp(): void {
    this.retrieve();
  }

  public onPageChange(event: PaginatorState): void {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    this.employeeListFacade.retrieve(this.employeeSearch, this.page);
  }

  public refresh(): void {
    this.retrieve();
  }

  public retrieve(): void {
    this.checkSearchFields() ? this.search() : this.getAll();
  }

  public search(): void {
    this.employeeListFacade.search(this.employeeSearch, this.page);
  }

  public setEditParams(editVisible: boolean, id: number | null, modalTitle: string, disable: boolean): void {
    this.editVisible = editVisible;
    this.employeeId = id;
    this.modalTitle = modalTitle;
    this.disable = disable;
  }

  public showDialog(visible: boolean, id?: number): void {
    this.employeeId = id ?? 0;
    this.visible = visible;
  }
}
