import { inject } from "@angular/core";
import { BehaviorSubject, catchError, finalize, map, Observable, of, OperatorFunction, tap } from "rxjs";
import { CustomMessageService } from "../custom-message/custom-message.service";
import { BaseCrudService } from "./base-crud.service";

export abstract class BaseEditFacade<T extends { id?: number }> {

  protected readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  // ViewModel can be extended in the derived class
  readonly viewModel$ = this.loading$.pipe(map(loading => ({ loading })));

  protected readonly _customMessageService = inject(CustomMessageService);

  protected constructor(protected readonly baseService: BaseCrudService<T>) { }

  submit(entity: T): Observable<boolean> {
    const request$ = entity.id
      ? this.baseService.update(entity)
      : this.baseService.create(entity);
    return this._withLoading(() => {

      return request$.pipe(
        tap(() => this._customMessageService.showSuccess('Success', 'Saved')),
        map(() => true),
        this._handleError<boolean>(false)
      );
    });
  }

  protected _withLoading<T>(fn: () => Observable<T>): Observable<T> {
    this._loading$.next(true);
    return fn().pipe(finalize(() => this._loading$.next(false)));
  }

  protected _handleError<T>(fallback: T): OperatorFunction<T, T> {
    return catchError(err => {
      const msg = err?.error?.message ?? 'Unknown error';
      this._customMessageService.showError('Error', msg);
      return of(fallback);
    });
  }
}
