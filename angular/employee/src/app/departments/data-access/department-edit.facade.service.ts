import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable } from 'rxjs';
import { Department } from './department.model';
import { DepartmentService } from './department.service';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentEditFacadeService {

  private _departmentService = inject(DepartmentService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  viewModel$: Observable<{ loading: boolean }> = combineLatest({
    loading: this._loading.asObservable()
  });
  submit(department: Department): Observable<Department> {
    this._loading.next(true);
    const subscription = !department.id ?
      this._departmentService.save(department) :
      this._departmentService.update(department);
    return subscription.pipe(
      map((value: Department) => {
        if (value) {
          this._customMessageService.showSuccess('Success', 'Action perforemd successfully');
          return value;
        } else {
          return {};
        }
      }),
      catchError(err => { throw err.error.message }),
      finalize(() => this._loading.next(false)));
  }
}
