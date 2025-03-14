import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('DepartmentService', () => {
  let service: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(DepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
