import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { Observable } from 'rxjs';
import { RoleSearchResult } from './role-search-result.model';
import { Role } from './role.model';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseCrudService<Role> {

  baseUrl = "/api/roles";
}
