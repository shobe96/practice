import { TestBed } from '@angular/core/testing';

import { DepartmentListFacadeService } from './department-list.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('DepartmentListFacadeService', () => {
  let service: DepartmentListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(DepartmentListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
