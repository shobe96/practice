import { TestBed } from '@angular/core/testing';

import { RoleService } from './role.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
