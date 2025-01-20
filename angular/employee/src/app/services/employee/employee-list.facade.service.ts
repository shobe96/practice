import { inject, Injectable } from '@angular/core';
import { ListFacade } from '../../shared/list-facade';
import { Employee } from '../../models/employee.model';
import { BehaviorSubject, combineLatest, debounceTime, Observable } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { EmployeeService } from './employee.service';
import { PageEvent } from '../../models/page-event.model';
import { EmployeeSearchResult } from '../../models/employee-search-result.model';
import { rowsPerPage } from '../../shared/constants.model';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListFacadeService {

  private _employeeService = inject(EmployeeService);
  private _employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  }
  private _page: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(this._defaultPage);
  private _rowsPerPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(rowsPerPage);
  // private _messageService: MessageService = inject(MessageService);
  private _dialogOptions: BehaviorSubject<any> = new BehaviorSubject<any>({});

  public viewModel$: Observable<any> = combineLatest({
    employees: this._employees.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable(),
    dialogOptions: this._dialogOptions.asObservable()
  });

  addNew(): void { }

  checkSearchFields(employee: Employee): boolean {
    return Boolean(employee.name ||
      employee.surname ||
      employee.email);
  }
  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this.getAll(false);
  }
  delete(id: number | null, employee: Employee): void {
    if (id) {
      this._employeeService.delete(id).subscribe(() => {
        this.retrieve(employee);
        this.setDialogParams(0, 'Warning', false, false, false);
      });
    }
  }

  getAll(all: boolean): void {
    this._employeeService.getAllEmployees(all, this._defaultPage).subscribe((value: EmployeeSearchResult) => {
      this._emitValues(value);
    });
  }

  goToDetails(id: number): void { }
  goToEdit(id: number | null): void { }
  handleCancel(event: any): void { }

  onPageChange(employee: Employee, event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve(employee);
  }

  retrieve(employee: Employee): void {
    this.checkSearchFields(employee) ? this.search(employee) : this.getAll(false);
  }

  search(employeeSearch: Employee): void {
    this._employeeService.search(employeeSearch, this._defaultPage).pipe(debounceTime(2000)).subscribe((value: EmployeeSearchResult) => {
      this._emitValues(value);
    })
  }

  setDialogParams(id: number | null, modalTitle: string, editVisible: boolean, deleteVisible: boolean, disable: boolean): void {
    const dialogOptions: any = {}
    dialogOptions.disable = disable;
    dialogOptions.employeeId = id;
    dialogOptions.modalTitle = modalTitle;
    dialogOptions.editVisible = editVisible;
    dialogOptions.deleteVisible = deleteVisible;
    this._dialogOptions.next(dialogOptions);
  }

  showDialog(visible: boolean, id?: number): void {
    this._dialogOptions.next({});
  }

  private _emitValues(value: EmployeeSearchResult) {
    if (value.employees) {
      this._employees.next(value.employees);
    }
    if (value.size) {
      this._defaultPage.pageCount = value.size;
      this._page.next(this._defaultPage);
    }
  }
}
