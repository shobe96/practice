import { TestBed } from '@angular/core/testing';

import { ProjectDetailsFacadeService } from './project-details.facade.service';

describe('ProjectDetailsFacadeService', () => {
  let service: ProjectDetailsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectDetailsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
