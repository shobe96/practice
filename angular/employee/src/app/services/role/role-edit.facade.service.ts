import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { Role } from '../../models/role.model';
import { enumSeverity } from '../../shared/constants.model';
import { fireToast } from '../../shared/utils';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class RoleEditFacadeService {

  private _roleService: RoleService = inject(RoleService);
  private _messageService: MessageService = inject(MessageService);

  submit(role: Role): Observable<Role> {
    const subscription = !role.id ?
      this._roleService.save(role) :
      this._roleService.update(role);
    return subscription.pipe(map((value: Role) => {
      if (value) {
        fireToast(enumSeverity.success, 'Success', 'Action perforemd successfully', this._messageService);
        return value;
      } else {
        return {};
      }
    }));
  }
}
