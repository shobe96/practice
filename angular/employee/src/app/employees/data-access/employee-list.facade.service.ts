import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { EmployeeService } from './employee.service';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';
import { EmployeeSearchCriteria } from './employee-search.criteria';

@Injectable()
export class EmployeeListFacadeService extends BaseListFacade<Employee, EmployeeSearchCriteria> {

  protected override _search: EmployeeSearchCriteria = {};

  searchKeys = ['name', 'surname', 'email'];

  constructor(employeeService: EmployeeService) {
    super(employeeService);
  }
}
