import { TestBed } from '@angular/core/testing';

import { RoleEditFacadeService } from './role-edit.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('RoleEditFacadeService', () => {
  let service: RoleEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(RoleEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
