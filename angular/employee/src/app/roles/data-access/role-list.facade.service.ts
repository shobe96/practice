import { Injectable } from '@angular/core';
import { Role } from './role.model';
import { RoleService } from './role.service';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';

@Injectable()
export class RoleListFacadeService extends BaseListFacade<Role> {

  protected override _search: Role = {}

  searchKeys = ['name'];

  constructor(roleService: RoleService) {
    super(roleService);
  }
}
