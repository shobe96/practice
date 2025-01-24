import { TestBed } from '@angular/core/testing';

import { DepartmentEditFacadeService } from './department-edit.facade.service';

describe('DepartmentEditFacadeService', () => {
  let service: DepartmentEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
