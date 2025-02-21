import { inject, Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Observable, catchError, combineLatest } from 'rxjs';
import { PageEvent } from '../../models/page-event.model';
import { RoleSearchResult } from '../../models/role-search-result.model';
import { Role } from '../../models/role.model';
import { rowsPerPage } from '../../shared/constants.model';
import { RoleService } from './role.service';
import { CustomMessageService } from '../custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class RoleListFacadeService {

  private _roleSearch: Role = {}
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

  viewModel$: Observable<{ roles: Role[], page: PageEvent, rowsPerPage: number[] }> = combineLatest({
    roles: this._roles.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable()
  });

  private _roleService: RoleService = inject(RoleService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this._getAll(false);
  }

  delete(id: number | null): void {
    if (id) {
      const roleObserver = {
        next: () => { this.retrieve(); },
        error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
        complete: () => {
          // do nothing.
        }
      }
      this._roleService.delete(id)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(roleObserver);
    }
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    const roleObserver = {
      next: (value: RoleSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    if (this._checkSearchFields())
      this._roleService.search(this._roleSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(roleObserver);
    else this._getAll(false);
  }

  search(params: Role): void {
    this._roleSearch = params;
    const roleObserver = {
      next: (value: RoleSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    if (this._checkSearchFields()) {
      this._roleService.search(this._roleSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(roleObserver);
    }
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

  private _checkSearchFields(): boolean {
    return Boolean(this._roleSearch.name);
  }

  private _getAll(all: boolean): void {
    const roleObserver = {
      next: (value: RoleSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => {
        // do nothing.
      }
    }
    this._roleService.getAllRoles(all, this._defaultPage)
      .pipe(catchError((err) => { throw err.error.message }))
      .subscribe(roleObserver);
  }
}
