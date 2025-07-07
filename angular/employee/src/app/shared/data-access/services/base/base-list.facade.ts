import { BehaviorSubject, catchError, combineLatest, finalize, Observable, of, tap } from "rxjs";
import { PageEvent } from "../../page-event.model";
import { rowsPerPage } from "../../../constants.model";
import { inject } from "@angular/core";
import { BaseCrudService } from "./base-crud.service";
import { SearchResult } from "../../search-result.model";
import { CustomMessageService } from "../custom-message/custom-message.service";
import { PaginatorState } from "primeng/paginator";
import { ListState } from "../../list-state.model";

export abstract class BaseListFacade<T extends object> {
  private _data$ = new BehaviorSubject<T[]>([]);
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

  private readonly _customMessageService = inject(CustomMessageService);

  protected abstract _search: T;

  viewModel$: Observable<ListState<T>> = combineLatest({
    data: this._data$.asObservable(),
    page: this._page$.asObservable(),
    rowsPerPage: this._rowsPerPage$.asObservable(),
    loading: this._loading$.asObservable()
  });

  protected constructor(protected readonly baseService: BaseCrudService<T>) { }

  protected abstract readonly searchKeys: (keyof T)[];

  clear(): void {
    this._updatePage({ page: 0, first: 0 });
    this._getAll(false);
  }

  delete(id: number | null): void {
    if (!id) return;

    this._withLoading(() =>
      this.baseService.delete(id).pipe(
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
      ? this.baseService.search(this._search, this._page$.value)
      : this.baseService.getAll(false, this._page$.value);

    this._withLoading(() =>
      fetch$.pipe(
        tap(result => this._processResult(result)),
        this._handleError('Error', null)
      )
    );
  }

  private _getAll(all: boolean): void {
    this._withLoading(() =>
      this.baseService.getAll(all, this._page$.value).pipe(
        tap(result => this._processResult(result)),
        this._handleError('Error', null)
      )
    );
  }

  private _updatePage(update: Partial<PageEvent>): void {
    const current = this._page$.value;
    this._page$.next({ ...current, ...update });
  }

  private _processResult(result: SearchResult<T> | null): void {
    if (!result) return;
    this._data$.next(result.items ?? []);
    if (result.size != null) {
      const updatedPage = { ...this._page$.value, pageCount: result.size };
      this._page$.next(updatedPage);
    }
  }

  private _withLoading<T>(fn: () => Observable<T>): void {
    this._loading$.next(true);
    fn().pipe(finalize(() => this._loading$.next(false))).subscribe();
  }

  private _handleError<T>(severity: 'Error' | 'Warning', fallback: T) {
    return catchError((err) => {
      const msg = err?.error?.message ?? 'Unknown error';
      if (severity === 'Error')
        this._customMessageService.showError(severity, msg)
      else this._customMessageService.showWarn(severity, msg);
      return of(fallback);
    });
  }

  search(params: T): void {
    this._search = params;
    if (!this._hasSearchFields()) return;
    this._withLoading(() =>
      this.baseService.search(this._search, this._page$.value).pipe(
        tap(result => this._processResult(result)),
        this._handleError('Error', null)
      )
    );
  }

  private _hasSearchFields(): boolean {
    return this.searchKeys.some(key => {
      const value = this._search[key];
      return value !== undefined && value !== null && value !== '';
    });
  }
}
