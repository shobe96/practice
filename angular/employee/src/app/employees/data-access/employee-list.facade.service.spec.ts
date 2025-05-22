import { TestBed } from '@angular/core/testing';

import { EmployeeListFacadeService } from './employee-list.facade.service';
import { EmployeeService } from './employee.service';
import { CustomMessageService } from '../../shared/data-access/custom-message.service';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('EmployeeListFacadeService', () => {
  let service: EmployeeListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService, CustomMessageService, MessageService, HttpClient, HttpHandler]
    });
    service = TestBed.inject(EmployeeListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
