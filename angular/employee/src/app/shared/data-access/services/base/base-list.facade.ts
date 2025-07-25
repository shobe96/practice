import { BehaviorSubject, catchError, combineLatest, finalize, Observable, of, tap } from "rxjs";
import { PageEvent } from "../../page-event.model";
import { rowsPerPage } from "../../../constants.model";
import { inject } from "@angular/core";
import { BaseCrudService } from "./base-crud.service";
import { SearchResult } from "../../search-result.model";
import { CustomMessageService } from "../custom-message/custom-message.service";
import { PaginatorState } from "primeng/paginator";
import { ListState } from "../../list-state.model";

export abstract class BaseListFacade<T extends object, C extends object = {}> {
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

  protected abstract _search: C;

  protected get page(): PageEvent {
    return this._page$.getValue();
  }

  viewModel$: Observable<ListState<T>> = combineLatest({
    data: this._data$.asObservable(),
    page: this._page$.asObservable(),
    rowsPerPage: this._rowsPerPage$.asObservable(),
    loading: this._loading$.asObservable()
  });

  protected constructor(protected readonly baseService: BaseCrudService<T, C>) { }

  protected abstract readonly searchKeys: (keyof T)[];

  clear(): void {
    this._updatePage({ page: 0, first: 0 });
    this.retrieve();
  }

  delete(id: number | null): void {
    if (!id) return;

    this._withLoading(() =>
      this.baseService.delete(id).pipe(
        tap(() => {
          const currentData = this._data$.getValue();
          const currentPage = this.page;

          // If deleting the last item on a non-first page, go to the previous page
          if (currentData.length === 1 && currentPage.page > 0) {
            this._updatePage({
              page: currentPage.page - 1,
              first: currentPage.first - currentPage.rows
            });
          }

          this.retrieve(); // only call retrieve once
        }),
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
    this._withLoading(() =>
      this.baseService.search(this._search, this.page).pipe(
        tap(result => this._processResult(result)),
        this._handleError('Error', null)
      )
    );
  }

  private _updatePage(update: Partial<PageEvent>): void {
    const current = this.page;
    this._page$.next({ ...current, ...update });
  }

  private _processResult(result: SearchResult<T> | null): void {
    if (!result) return;
    this._data$.next(result.items ?? []);
    if (result.size) {
      const updatedPage = { ...this.page, pageCount: result.size };
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

  search(params: C): void {
    this._search = params;
    if (this.page.page !== 0) this.page.page = 0;
    this._withLoading(() =>
      this.baseService.search(this._search, this.page).pipe(
        tap(result => this._processResult(result)),
        this._handleError('Error', null)
      )
    );
  }
}
