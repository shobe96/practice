import { TestBed } from '@angular/core/testing';

import { ProjectListFacadeService } from './project-list.facade.service';

describe('ProjectListFacadeService', () => {
  let service: ProjectListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
