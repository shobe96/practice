import { TestBed } from '@angular/core/testing';

import { ProjectHistoryService } from './project-history.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ProjectHistoryService', () => {
  let service: ProjectHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(ProjectHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
