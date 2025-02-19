import { inject, Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Observable, catchError, combineLatest } from 'rxjs';
import { PageEvent } from '../../models/page-event.model';
import { UserSearchResult } from '../../models/user-search-result.model';
import { User } from '../../models/user.model';
import { rowsPerPage } from '../../shared/constants.model';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CustomMessageService } from '../custom-message.service';

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
  private _userSearch: User = {}

  viewModel$: Observable<any> = combineLatest({
    users: this._users.asObservable(),
    page: this._page.asObservable(),
    rowsPerPage: this._rowsPerPage.asObservable()
  });

  private _userService = inject(UserService);
  private _authService = inject(AuthService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  clear(): void {
    this._defaultPage.page = 0;
    this._defaultPage.first = 0;
    this._getAll();
  }

  delete(id: number | null): void {
    if (id) {
      const authObserver = {
        next: () => { this.retrieve(); },
        error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
        complete: () => { }
      }
      this._authService.delete(id)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(authObserver);
    }
  }

  onPageChange(event: PaginatorState): void {
    this._defaultPage.first = event.first ?? 0;
    this._defaultPage.page = event.page ?? 0;
    this._defaultPage.rows = event.rows ?? 0;
    this.retrieve();
  }

  retrieve(): void {
    const userObserver = {
      next: (value: UserSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    if (this._checkSearchFields())
      this._userService.search(this._userSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(userObserver);
    else this._getAll();
  }

  search(params: User): void {
    this._userSearch = params;
    const userObserver = {
      next: (value: UserSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    if (this._checkSearchFields()) {
      this._userService.search(this._userSearch, this._defaultPage)
        .pipe(catchError((err) => { throw err.error.message }))
        .subscribe(userObserver);
    }
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

  private _getAll(): void {
    const userObserver = {
      next: (value: UserSearchResult) => { this._emitValues(value) },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
      complete: () => { }
    }
    this._userService.getAllUsers(this._defaultPage)
      .pipe(catchError((err) => { throw err.error.message }))
      .subscribe(userObserver);
  }
}
