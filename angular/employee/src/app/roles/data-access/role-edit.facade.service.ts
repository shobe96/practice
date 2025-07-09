import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, finalize, map } from 'rxjs';
import { Role } from './role.model';
import { RoleService } from './role.service';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';
import { BaseEditFacade } from '../../shared/data-access/services/base/base-edit.facade';

@Injectable({
  providedIn: 'root'
})
export class RoleEditFacadeService extends BaseEditFacade<Role> {

  constructor(roleService: RoleService) {
    super(roleService);
  }
}
