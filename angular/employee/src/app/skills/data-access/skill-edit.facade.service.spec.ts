import { TestBed } from '@angular/core/testing';

import { SkillEditFacadeService } from './skill-edit.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('SkillEditFacadeService', () => {
  let service: SkillEditFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(SkillEditFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
