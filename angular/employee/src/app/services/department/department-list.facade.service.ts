import { inject, Injectable, OnDestroy } from '@angular/core';
import { DepartmentService } from './department.service';
import { BehaviorSubject, combineLatest, debounce, debounceTime, distinctUntilChanged, exhaustMap, first, Observable, Subscription, switchMap, take, takeLast, takeUntil, tap, withLatestFrom } from 'rxjs';
import { Department } from '../../models/department.model';
import { PageEvent } from '../../models/page-event.model';
import { rowsPerPage } from '../../shared/constants.model';
import { DepartmentSearchResult } from '../../models/department-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DepartmentListFacadeService {
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _departmentService: DepartmentService = inject(DepartmentService);

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
  private _dialogOptions: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _routeSubscription: Subscription | undefined;

  viewModel$: Observable<any> = combineLatest({
    departments: this._departments.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable(),
    dialogOptions: this._dialogOptions.asObservable()
  });

  unsubscribe() {
    if (this._routeSubscription)
      this._routeSubscription.unsubscribe();
  }

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this.getAll(false);
  }

  getAll(all: boolean): void {
    this._departmentService.getAllDepartments(all, this._defaultPage).subscribe((value: DepartmentSearchResult) => {
      this._emitValues(value);
    });
  }

  delete(id: number | null): void {
    if (id) {
      this._departmentService.delete(id).subscribe(() => {
        this.retrieve();
        this.setDialogParams(null, 'Warning', false, false, false);
      });
    }
  }

  setDialogParams(department: Department | null, modalTitle: string, editVisible: boolean, deleteVisible: boolean, disable: boolean): void {
    const dialogOptions: any = {};
    dialogOptions.disable = disable;
    dialogOptions.modalTitle = modalTitle;
    dialogOptions.editVisible = editVisible;
    dialogOptions.deleteVisible = deleteVisible;
    dialogOptions.department = department ?? {};
    this._dialogOptions.next(dialogOptions);
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    if (this._checkSearchFields())
      this._departmentService.search(this._departmentSearch, this._defaultPage).subscribe((value: DepartmentSearchResult) => this._emitValues(value));
    else this.getAll(false);
  }

  search(): void {
    this._routeSubscription = this._activatedRoute.queryParams
      .pipe(
        switchMap((params: any) => {
          this._departmentSearch = {
            name: params.name
          }
          if (this._checkSearchFields()) {
            return this._departmentService.search(this._departmentSearch, this._defaultPage);
          } else {
            return [];
          }

        })
      )
      .subscribe((value: DepartmentSearchResult) => {
        this._emitValues(value);
      });
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
}
