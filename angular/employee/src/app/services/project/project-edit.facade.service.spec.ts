import { TestBed } from '@angular/core/testing';

import { ProjectEditFacadeService } from './project-edit.facade.service';

describe('ProjectEditFacadeService', () => {
  let service: ProjectEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
