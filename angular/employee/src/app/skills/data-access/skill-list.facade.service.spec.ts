import { TestBed } from '@angular/core/testing';

import { SkillListFacadeService } from './skill-list.facade.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('SkillListFacadeService', () => {
  let service: SkillListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, MessageService]
    });
    service = TestBed.inject(SkillListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
