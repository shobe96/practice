import { inject, Injectable } from '@angular/core';
import { DepartmentService } from './department.service';
import { BehaviorSubject, catchError, combineLatest, Observable } from 'rxjs';
import { Department } from '../../models/department.model';
import { PageEvent } from '../../models/page-event.model';
import { rowsPerPage } from '../../shared/constants.model';
import { DepartmentSearchResult } from '../../models/department-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { CustomMessageService } from '../custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentListFacadeService {

  private _departmentSearch: Department = {}
  private _departments: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);
  private _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  }
  private _page: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(this._defaultPage);
  private _rowsPerPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(rowsPerPage);

  viewModel$: Observable<any> = combineLatest({
    departments: this._departments.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable()
  });

  private _departmentService: DepartmentService = inject(DepartmentService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this._getAll(false);
  }

  delete(id: number | null): void {
    const departmentObserver = {
      next: () => { this.retrieve(); },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    if (id) {
      this._departmentService.delete(id).pipe(catchError((err) => { throw err.error.message })).subscribe(departmentObserver);
    }
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    const departmentObserver = {
      next: (value: DepartmentSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    if (this._checkSearchFields())
      this._departmentService.search(this._departmentSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(departmentObserver);
    else this._getAll(false);
  }

  search(params: Department): void {
    this._departmentSearch = params;
    const departmentObserver = {
      next: (value: DepartmentSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    if (this._checkSearchFields()) {
      this._departmentService.search(this._departmentSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(departmentObserver);
    }
  }

  private _emitValues(value: DepartmentSearchResult): void {
    if (value.departments) {
      this._departments.next(value.departments);
    }
    if (value.size) {
      this._defaultPage.pageCount = value.size;
      this._page.next(this._defaultPage);
    }
  }

  private _checkSearchFields(): boolean {
    return Boolean(this._departmentSearch.name);
  }

  private _getAll(all: boolean): void {
    const departmentObserver = {
      next: (value: DepartmentSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    this._departmentService.getAllDepartments(all, this._defaultPage)
      .pipe(catchError((err) => { throw err.error.message }))
      .subscribe(departmentObserver);
  }
}
