import { TestBed } from '@angular/core/testing';

import { ProjectEditFacadeService } from './project-edit.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('ProjectEditFacadeService', () => {
  let service: ProjectEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(ProjectEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
