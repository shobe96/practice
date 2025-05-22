import { TestBed } from '@angular/core/testing';

import { ProjectListFacadeService } from './project-list.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('ProjectListFacadeService', () => {
  let service: ProjectListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(ProjectListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
