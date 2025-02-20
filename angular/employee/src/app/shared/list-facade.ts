import { PaginatorState } from "primeng/paginator";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";

export abstract class ListFacade<T> {
  private data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  viewModel: Observable<any> = combineLatest({
    data: this.data.asObservable(),
  })
  abstract addNew(): void;
  abstract checkSearchFields(): boolean
  abstract clear(): void
  abstract delete(): void
  abstract getAll(): void
  abstract goToDetails(id: number): void
  abstract goToEdit(id: number | null): void
  abstract handleCancel(event: any): void
  abstract onKeyUp(): void
  abstract onPageChange(event: PaginatorState): void
  abstract refresh(): void
  abstract retrieve(): void
  abstract search(): void
  abstract setEditParams(editVisible: boolean, id: number | null, modalTitle: string, disable: boolean): void
  abstract showDialog(visible: boolean, id?: number): void
}
