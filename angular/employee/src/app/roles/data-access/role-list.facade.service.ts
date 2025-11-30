import { Injectable } from '@angular/core';
import { Role } from './role.model';
import { RoleService } from './role.service';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';
import { RoleSearchCriteria } from './role-search.criteria';

@Injectable()
export class RoleListFacadeService extends BaseListFacade<Role, RoleSearchCriteria> {

  protected override _search: Role = {}

  searchKeys = ['name', 'userId'];

  constructor(roleService: RoleService) {
    super(roleService);
  }
}
