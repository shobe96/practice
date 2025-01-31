import { inject, Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Observable, combineLatest, debounceTime } from 'rxjs';
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

  private _userService = inject(UserService);
  private _authService = inject(AuthService);
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

  viewModel$: Observable<any> = combineLatest({
    users: this._users.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable(),
    dialogOptions: this._dialogOptions.asObservable()
  });

  checkSearchFields(user: User): boolean {
    return Boolean(user.username);
  }

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this.getAll();
  }

  delete(id: number | null, userSearch: User): void {
    if (id) {
      this._authService.delete(id).subscribe(() => {
        this.retrieve(userSearch);
        this.setDialogParams(null, 'Warning', false, false, false);
      })
    }
  }

  getAll(): void {
    this._userService.getAllUsers(this._defaultPage).subscribe((value: UserSearchResult) => {
      this._emitValues(value);
    });
  }

  onPageChange(userSearch: User, event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve(userSearch);
  }

  retrieve(userSearch: User): void {
    if (this.checkSearchFields(userSearch))
      this.search(userSearch)
    else this.getAll();
  }

  search(userSearch: User): void {
    this._userService.search(userSearch, this._defaultPage)
      .pipe(
        debounceTime(2000)
      )
      .subscribe((value: UserSearchResult) => {
        this._emitValues(value);
      })
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
}
