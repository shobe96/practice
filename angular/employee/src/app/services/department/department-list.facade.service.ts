import { inject, Injectable } from '@angular/core';
import { DepartmentService } from './department.service';
import { BehaviorSubject, combineLatest, Observable, Subscription, switchMap } from 'rxjs';
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

  viewModel$: Observable<any> = combineLatest({
    departments: this._departments.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable()
  });

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this._getAll(false);
  }

  delete(id: number | null): void {
    if (id) {
      this._departmentService.delete(id).subscribe(() => {
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
      this._departmentService.search(this._departmentSearch, this._defaultPage).subscribe((value: DepartmentSearchResult) => this._emitValues(value));
    else this._getAll(false);
  }

  search(params: Department): void {
    this._departmentSearch = params;
    if (this._checkSearchFields()) {
      this._departmentService.search(this._departmentSearch, this._defaultPage).subscribe((value: DepartmentSearchResult) => {
        this._emitValues(value);
      });
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
    this._departmentService.getAllDepartments(all, this._defaultPage).subscribe((value: DepartmentSearchResult) => {
      this._emitValues(value);
    });
  }
}
