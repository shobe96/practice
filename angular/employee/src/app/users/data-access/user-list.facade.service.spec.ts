import { TestBed } from '@angular/core/testing';

import { UserListFacadeService } from './user-list.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('UserListFacadeService', () => {
  let service: UserListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(UserListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
