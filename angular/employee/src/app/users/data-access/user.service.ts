import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { UserSearchResult } from './user-search-result.model';
import { environment } from '../../../environments/environment.development';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService<User> {

  baseUrl = "/api/users"

}
