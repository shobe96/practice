import { TestBed } from '@angular/core/testing';

import { EmployeeEditFacadeService } from './employee-edit.facade.service';

describe('EmployeeEditFacadeService', () => {
  let service: EmployeeEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
