import { TestBed } from '@angular/core/testing';

import { ProjectDetailsFacadeService } from './project-details.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('ProjectDetailsFacadeService', () => {
  let service: ProjectDetailsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(ProjectDetailsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
