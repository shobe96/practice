import { TestBed } from '@angular/core/testing';

import { EmployeeEditFacadeService } from './employee-edit.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('EmployeeEditFacadeService', () => {
  let service: EmployeeEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(EmployeeEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
