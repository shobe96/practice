import { TestBed } from '@angular/core/testing';

import { SkillService } from './skill.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(SkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
