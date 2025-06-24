import { PaginatorState } from "primeng/paginator";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { PageEvent } from "./data-access/page-event.model";
import { rowsPerPage } from "./constants.model";

export abstract class BaseListFacade<T> {
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

  viewModel: Observable<{ data: T[] }> = combineLatest({
    data: this._data$.asObservable(),
    page: this._page$.asObservable(),
    rowsPerPage: this._rowsPerPage$.asObservable(),
    loading: this._loading$.asObservable()
  });
  abstract addNew(): void;
  abstract checkSearchFields(): boolean
  abstract clear(): void
  abstract delete(): void
  abstract getAll(): void
  abstract goToDetails(id: number): void
  abstract goToEdit(id: number | null): void
  abstract onKeyUp(): void
  abstract onPageChange(event: PaginatorState): void
  abstract refresh(): void
  abstract retrieve(): void
  abstract search(): void
  abstract setEditParams(editVisible: boolean, id: number | null, modalTitle: string, disable: boolean): void
  abstract showDialog(visible: boolean, id?: number): void
}
