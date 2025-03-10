import { TestBed } from '@angular/core/testing';

import { DepartmentListFacadeService } from './department-list.facade.service';

describe('DepartmentListFacadeService', () => {
  let service: DepartmentListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
