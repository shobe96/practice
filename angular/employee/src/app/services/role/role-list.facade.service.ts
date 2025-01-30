import { inject, Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Observable, combineLatest, debounceTime } from 'rxjs';
import { PageEvent } from '../../models/page-event.model';
import { RoleSearchResult } from '../../models/role-search-result.model';
import { Role } from '../../models/role.model';
import { rowsPerPage } from '../../shared/constants.model';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class RoleListFacadeService {

  private _roleService = inject(RoleService);
  private _roles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
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

  viewModel$: Observable<any> = combineLatest({
    roles: this._roles.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable(),
    dialogOptions: this._dialogOptions.asObservable()
  });

  checkSearchFields(role: Role): boolean {
    return Boolean(role.name)
  }

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this.getAll(false);
  }

  delete(id: number | null, roleSearch: Role): void {
    if (id) {
      this._roleService.delete(id).subscribe(() => {
        this.retrieve(roleSearch);
        this.setDialogParams(null, 'Warning', false, false, false);
      });
    }
  }

  getAll(all: boolean): void {
    this._roleService.getAllRoles(all, this._defaultPage).subscribe((value: RoleSearchResult) => {
      this._emitValues(value);
    });
  }

  onPageChange(roleSearch: Role, event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve(roleSearch);
  }

  retrieve(roleSearch: Role): void {
    if (this.checkSearchFields(roleSearch))
      this.search(roleSearch)
    else this.getAll(false);
  }

  search(roleSearch: Role): void {
    this._roleService.search(roleSearch, this._defaultPage)
      .pipe(
        debounceTime(2000)
      )
      .subscribe((value: RoleSearchResult) => {
        this._emitValues(value);
      })
  }

  setDialogParams(role: Role | null, modalTitle: string, editVisible: boolean, deleteVisible: boolean, disable: boolean): void {
    const dialogOptions: any = {};
    dialogOptions.disable = disable;
    dialogOptions.modalTitle = modalTitle;
    dialogOptions.editVisible = editVisible;
    dialogOptions.deleteVisible = deleteVisible;
    dialogOptions.role = role ?? {};
    this._dialogOptions.next(dialogOptions);
  }

  private _emitValues(value: RoleSearchResult): void {
    if (value.roles) {
      this._roles.next(value.roles);
    }
    if (value.size) {
      this._defaultPage.pageCount = value.size;
      this._page.next(this._defaultPage);
    }
  }
}
