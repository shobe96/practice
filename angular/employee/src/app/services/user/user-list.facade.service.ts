import { inject, Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { PageEvent } from '../../models/page-event.model';
import { UserSearchResult } from '../../models/user-search-result.model';
import { User } from '../../models/user.model';
import { rowsPerPage } from '../../shared/constants.model';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserListFacadeService {

  private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
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
  private _userSearch: User = {}

  viewModel$: Observable<any> = combineLatest({
    users: this._users.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable(),
    dialogOptions: this._dialogOptions.asObservable()
  });

  private _userService = inject(UserService);
  private _authService = inject(AuthService);

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this.getAll();
  }

  delete(id: number | null): void {
    if (id) {
      this._authService.delete(id).subscribe(() => {
        this.retrieve();
        this.setDialogParams(null, 'Warning', false, false, false);
      })
    }
  }

  getAll(): void {
    this._userService.getAllUsers(this._defaultPage).subscribe((value: UserSearchResult) => {
      this._emitValues(value);
    });
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    if (this._checkSearchFields())
      this._userService.search(this._userSearch, this._defaultPage).subscribe((value: UserSearchResult) => this._emitValues(value));
    else this.getAll();
  }

  search(params: User): void {
    this._userSearch = params;
    if (this._checkSearchFields()) {
      this._userService.search(this._userSearch, this._defaultPage).subscribe((value: UserSearchResult) => {
        this._emitValues(value);
      });
    }
  }

  setDialogParams(user: User | null, modalTitle: string, editVisible: boolean, deleteVisible: boolean, disable: boolean): void {
    const dialogOptions: any = {};
    dialogOptions.disable = disable;
    dialogOptions.modalTitle = modalTitle;
    dialogOptions.editVisible = editVisible;
    dialogOptions.deleteVisible = deleteVisible;
    dialogOptions.user = user ?? {};
    this._dialogOptions.next(dialogOptions);
  }

  private _emitValues(value: UserSearchResult): void {
    if (value.users) {
      this._users.next(value.users);
    }
    if (value.size) {
      this._defaultPage.pageCount = value.size;
      this._page.next(this._defaultPage);
    }
  }

  private _checkSearchFields(): boolean {
    return Boolean(this._userSearch.username);
  }
}
