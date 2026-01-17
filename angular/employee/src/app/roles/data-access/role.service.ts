import { Injectable } from '@angular/core';
import { Role } from './role.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';
import { RoleSearchCriteria } from './role-search.criteria';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseCrudService<Role, RoleSearchCriteria> {

  baseUrl = "/api/roles";
}
