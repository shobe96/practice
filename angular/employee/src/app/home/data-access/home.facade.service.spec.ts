import { TestBed } from '@angular/core/testing';

import { HomeFacadeService } from './home.facade.service';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('HomeFacadeService', () => {
  let service: HomeFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(HomeFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
