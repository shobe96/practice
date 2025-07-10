import { Injectable } from '@angular/core';
import { Role } from './role.model';
import { RoleService } from './role.service';
import { BaseEditFacade } from '../../shared/data-access/services/base/base-edit.facade';

@Injectable({
  providedIn: 'root'
})
export class RoleEditFacadeService extends BaseEditFacade<Role> {

  constructor(roleService: RoleService) {
    super(roleService);
  }
}
