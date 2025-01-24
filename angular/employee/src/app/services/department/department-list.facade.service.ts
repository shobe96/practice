import { inject, Injectable } from '@angular/core';
import { DepartmentService } from './department.service';
import { BehaviorSubject, combineLatest, debounceTime, Observable } from 'rxjs';
import { Department } from '../../models/department.model';
import { PageEvent } from '../../models/page-event.model';
import { rowsPerPage } from '../../shared/constants.model';
import { DepartmentSearchResult } from '../../models/department-search-result.model';
import { PaginatorState } from 'primeng/paginator';

@Injectable({
  providedIn: 'root'
})
export class DepartmentListFacadeService {
  private _departmentService: DepartmentService = inject(DepartmentService);
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

  public viewModel$: Observable<any> = combineLatest({
    departments: this._departments.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable(),
    dialogOptions: this._dialogOptions.asObservable()
  });

  public checkSearchFields(department: Department): boolean {
    return Boolean(department.name);
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

  delete(id: number | null, departmentSearch: Department): void {
    if (id) {
      this._departmentService.delete(id).subscribe(() => {
        this.retrieve(departmentSearch);
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

  onPageChange(departmentSearch: Department, event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve(departmentSearch);
  }

  retrieve(departmentSearch: Department): void {
    if (this.checkSearchFields(departmentSearch))
      this.search(departmentSearch)
    else this.getAll(false);
  }

  search(departmentSearch: Department): void {
    this._departmentService.search(departmentSearch, this._defaultPage)
      .pipe(
        debounceTime(2000)
      )
      .subscribe((value: DepartmentSearchResult) => {
        this._emitValues(value);
      })
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
}
