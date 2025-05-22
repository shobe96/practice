import { TestBed } from '@angular/core/testing';

import { RoleListFacadeService } from './role-list.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('RoleListFacadeService', () => {
  let service: RoleListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(RoleListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
