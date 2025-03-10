import { TestBed } from '@angular/core/testing';

import { RoleEditFacadeService } from './role-edit.facade.service';

describe('RoleEditFacadeService', () => {
  let service: RoleEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
