import { inject, Injectable } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { BehaviorSubject, catchError, combineLatest, Observable } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { EmployeeService } from './employee.service';
import { PageEvent } from '../../models/page-event.model';
import { EmployeeSearchResult } from '../../models/employee-search-result.model';
import { rowsPerPage } from '../../shared/constants.model';
import { CustomMessageService } from '../custom-message.service';

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
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

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
      const employeeObserver = {
        next: () => { this.retrieve(); },
        error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
        complete: () => { }
      }
      this._employeeService.delete(id).pipe(catchError((err) => { throw err.error.message })).subscribe(employeeObserver);
    }
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    const employeeObserver = {
      next: (value: EmployeeSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    if (this._checkSearchFields())
      this._employeeService.search(this._employeeSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(employeeObserver);
    else this._getAll(false);
  }

  search(params: Employee): void {
    this._employeeSearch = params;
    const employeeObserver = {
      next: (value: EmployeeSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    if (this._checkSearchFields()) {
      this._employeeService.search(this._employeeSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(employeeObserver);
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
    const employeeObserver = {
      next: (value: EmployeeSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    this._employeeService.getAllEmployees(all, this._defaultPage)
      .pipe(catchError((err) => { throw err.error.message }))
      .subscribe(employeeObserver);
  }
}
