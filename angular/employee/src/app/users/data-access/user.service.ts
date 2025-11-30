import { Injectable } from '@angular/core';
import { User } from './user.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';
import { UserSearchCriteria } from './user-search.criteria';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService<User, UserSearchCriteria> {

  baseUrl = "/api/users"

}
