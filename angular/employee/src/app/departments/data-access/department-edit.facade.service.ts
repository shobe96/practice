import { Injectable } from '@angular/core';
import { Department } from './department.model';
import { DepartmentService } from './department.service';
import { BaseEditFacade } from '../../shared/data-access/services/base/base-edit.facade';

@Injectable()
export class DepartmentEditFacadeService extends BaseEditFacade<Department> {

  constructor(departmentService: DepartmentService) {
    super(departmentService);
  }

}
