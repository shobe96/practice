import { TestBed } from '@angular/core/testing';

import { SkillEditFacadeService } from './skill-edit.facade.service';

describe('SkillEditFacadeService', () => {
  let service: SkillEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
