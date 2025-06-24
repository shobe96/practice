import { inject, Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { BehaviorSubject, catchError, combineLatest, finalize, Observable, of, tap, throwError } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { EmployeeService } from './employee.service';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { EmployeeSearchResult } from './employee-search-result.model';
import { rowsPerPage } from '../../shared/constants.model';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';
import { EmployeeState } from './employee-state';

@Injectable()
export class EmployeeListFacadeService {

  private _employees$ = new BehaviorSubject<Employee[]>([]);
  private _defaultPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  }
  private readonly _page$ = new BehaviorSubject<PageEvent>(this._defaultPage);
  private readonly _rowsPerPage$ = new BehaviorSubject<number[]>(rowsPerPage);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private _employeeSearch: Employee = {}
  private readonly _customMessageService = inject(CustomMessageService);

  viewModel$: Observable<EmployeeState> = combineLatest({
    employees: this._employees$.asObservable(),
    page: this._page$.asObservable(),
    rowsPerPage: this._rowsPerPage$.asObservable(),
    loading: this._loading$.asObservable()
  });

  private readonly _employeeService = inject(EmployeeService);

  clear(): void {
    this._updatePage({ page: 0, first: 0 });
    this._getAll(false);
  }

  delete(id: number | null): void {
    if (!id) return;

    this._withLoading(() =>
      this._employeeService.delete(id).pipe(
        tap(() => this.retrieve()),
        this._handleError('Error', null)
      )
    );
  }

  onPageChange(event: PaginatorState): void {
    this._updatePage({
      first: event.first ?? 0,
      page: event.page ?? 0,
      rows: event.rows ?? 0
    });
    this.retrieve();
  }

  retrieve(): void {
    const fetch$ = this._hasSearchFields()
      ? this._employeeService.search(this._employeeSearch, this._page$.value)
      : this._employeeService.getAllEmployees(false, this._page$.value);

    this._withLoading(() =>
      fetch$.pipe(
        tap(result => this._processResult(result)),
        this._handleError('Error', null)
      )
    );
  }

  search(params: Employee): void {
    this._employeeSearch = params;
    if (!this._hasSearchFields()) return;
    this._withLoading(() =>
      this._employeeService.search(this._employeeSearch, this._page$.value).pipe(
        tap(result => this._processResult(result)),
        this._handleError('Error', null)
      )
    );
  }

  private _getAll(all: boolean): void {
    this._withLoading(() =>
      this._employeeService.getAllEmployees(all, this._page$.value).pipe(
        tap(result => this._processResult(result)),
        this._handleError('Error', null)
      )
    );
  }

  private _withLoading<T>(fn: () => Observable<T>): void {
    this._loading$.next(true);
    fn().pipe(finalize(() => this._loading$.next(false))).subscribe();
  }

  private _handleError<T>(severity: 'Error' | 'Warning', fallback: T) {
    return catchError((err) => {
      const msg = err?.error?.message ?? 'Unknown error';
      severity === 'Error'
        ? this._customMessageService.showError(severity, msg)
        : this._customMessageService.showWarn(severity, msg);
      return of(fallback);
    });
  }

  private _updatePage(update: Partial<PageEvent>): void {
    const current = this._page$.value;
    this._page$.next({ ...current, ...update });
  }

  private _processResult(result: EmployeeSearchResult | null): void {
    if (!result) return;
    this._employees$.next(result.employees ?? []);
    if (result.size != null) {
      const updatedPage = { ...this._page$.value, pageCount: result.size };
      this._page$.next(updatedPage);
    }
  }

  private _hasSearchFields(): boolean {
    const { name, surname, email } = this._employeeSearch;
    return Boolean(name || surname || email);
  }
}
