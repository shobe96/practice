import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, finalize, map } from 'rxjs';
import { Role } from './role.model';
import { RoleService } from './role.service';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class RoleEditFacadeService {

  private _roleService: RoleService = inject(RoleService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  viewModel$: Observable<{ loading: boolean }> = combineLatest({
    loading: this._loading.asObservable()
  });

  submit(role: Role): Observable<Role> {
    this._loading.next(true);
    const subscription = !role.id ?
      this._roleService.save(role) :
      this._roleService.update(role);
    return subscription.pipe(
      map((value: Role) => {
        if (value) {
          this._customMessageService.showSuccess('Success', 'Action perforemd successfully');
          return value;
        } else {
          return {};
        }
      }),
      catchError((err) => { throw err.error.message }),
      finalize(() => this._loading.next(false)));
  }
}
