import { TestBed } from '@angular/core/testing';
import { AuthFacadeService } from './auth.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('AuthFacadeService', () => {
  let service: AuthFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(AuthFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
