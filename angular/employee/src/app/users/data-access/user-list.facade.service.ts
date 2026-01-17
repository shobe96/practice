import { Injectable } from '@angular/core';
import { User } from './user.model';
import { UserService } from './user.service';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';
import { UserSearchCriteria } from './user-search.criteria';

@Injectable()
export class UserListFacadeService extends BaseListFacade<User, UserSearchCriteria> {

  protected override _search: User = {};

  searchKeys = ['username'];

  constructor(userService: UserService) {
    super(userService);
  }
}
