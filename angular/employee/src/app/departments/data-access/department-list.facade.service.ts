import { Injectable } from '@angular/core';
import { DepartmentService } from './department.service';
import { Department } from './department.model';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';
import { DepartmentSearchCriteria } from './department-search.criteria';

@Injectable()
export class DepartmentListFacadeService extends BaseListFacade<Department, DepartmentSearchCriteria> {

  protected override _search: Department = {}

  searchKeys = ['name'];

  constructor(departmentService: DepartmentService) {
    super(departmentService);
  }

}
