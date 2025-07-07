import { Injectable } from '@angular/core';
import { Department } from './department.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseCrudService<Department> {

  baseUrl = "/api/departments";
}
