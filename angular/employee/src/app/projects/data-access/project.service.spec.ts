import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
