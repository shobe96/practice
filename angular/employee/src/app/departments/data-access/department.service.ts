import { Injectable } from '@angular/core';
import { Department } from './department.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';
import { DepartmentSearchCriteria } from './department-search.criteria';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseCrudService<Department, DepartmentSearchCriteria> {

  baseUrl = "/api/departments";
}
