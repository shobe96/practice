import { inject, Injectable } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { EmployeeService } from './employee.service';
import { PageEvent } from '../../models/page-event.model';
import { EmployeeSearchResult } from '../../models/employee-search-result.model';
import { rowsPerPage } from '../../shared/constants.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListFacadeService {

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
  private _employeeSearch: Employee = {}

  viewModel$: Observable<any> = combineLatest({
    employees: this._employees.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable()
  });

  private _employeeService = inject(EmployeeService);

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this._getAll(false);
  }

  delete(id: number | null): void {
    if (id) {
      this._employeeService.delete(id).subscribe(() => {
        this.retrieve();
      });
    }
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    if (this._checkSearchFields())
      this._employeeService.search(this._employeeSearch, this._defaultPage).subscribe((value: EmployeeSearchResult) => this._emitValues(value));
    else this._getAll(false);
  }

  search(params: Employee): void {
    this._employeeSearch = params;
    if (this._checkSearchFields()) {
      this._employeeService.search(this._employeeSearch, this._defaultPage).subscribe((value: EmployeeSearchResult) => {
        this._emitValues(value);
      });
    }
  }

  private _checkSearchFields(): boolean {
    return Boolean(this._employeeSearch.name ||
      this._employeeSearch.surname ||
      this._employeeSearch.email);
  }

  private _emitValues(value: EmployeeSearchResult): void {
    if (value.employees) {
      this._employees.next(value.employees);
    }
    if (value.size) {
      this._defaultPage.pageCount = value.size;
      this._page.next(this._defaultPage);
    }
  }

  private _getAll(all: boolean): void {
    this._employeeService.getAllEmployees(all, this._defaultPage).subscribe((value: EmployeeSearchResult) => {
      this._emitValues(value);
    });
  }
}
