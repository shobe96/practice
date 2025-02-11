import { TestBed } from '@angular/core/testing';

import { UserListFacadeService } from './user-list.facade.service';

describe('UserListFacadeService', () => {
  let service: UserListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
