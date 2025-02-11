import { TestBed } from '@angular/core/testing';

import { RoleListFacadeService } from './role-list.facade.service';

describe('RoleListFacadeService', () => {
  let service: RoleListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
