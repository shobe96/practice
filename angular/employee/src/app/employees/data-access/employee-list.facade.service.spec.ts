import { TestBed } from '@angular/core/testing';

import { EmployeeListFacadeService } from './employee-list.facade.service';

describe('EmployeeListFacadeService', () => {
  let service: EmployeeListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
