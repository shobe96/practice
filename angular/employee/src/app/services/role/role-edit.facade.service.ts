import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { Role } from '../../models/role.model';
import { RoleService } from './role.service';
import { CustomMessageService } from '../custom-message.service';

@Injectable({
  providedIn: 'root'
})
export class RoleEditFacadeService {

  private _roleService: RoleService = inject(RoleService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  submit(role: Role): Observable<Role> {
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
      catchError((err) => { throw err.error.message }));
  }
}
