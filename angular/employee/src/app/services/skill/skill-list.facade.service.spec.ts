import { TestBed } from '@angular/core/testing';

import { SkillListFacadeService } from './skill-list.facade.service';

describe('SkillListFacadeService', () => {
  let service: SkillListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
