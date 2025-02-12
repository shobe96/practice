import { PaginatorState } from "primeng/paginator";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";

export abstract class ListFacade<T> {
  private data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  viewModel: Observable<any> = combineLatest({
    data: this.data.asObservable(),
  })
  addNew(): void { }
  checkSearchFields(): boolean { return false; }
  clear(): void { }
  delete(): void { }
  getAll(): void { }
  goToDetails(id: number): void { }
  goToEdit(id: number | null): void { }
  handleCancel(event: any): void { }
  onKeyUp(): void { }
  onPageChange(event: PaginatorState): void { }
  refresh(): void { }
  retrieve(): void { }
  search(): void { }
  setEditParams(editVisible: boolean, id: number | null, modalTitle: string, disable: boolean): void { }
  showDialog(visible: boolean, id?: number): void { }
}
