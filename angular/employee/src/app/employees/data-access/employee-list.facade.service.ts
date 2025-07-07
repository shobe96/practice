import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { EmployeeService } from './employee.service';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';
import { SearchResult } from '../../shared/data-access/search-result.model';

@Injectable()
export class EmployeeListFacadeService extends BaseListFacade<Employee> {

  protected override _search: Employee = {};

  searchKeys = ['name', 'surname', 'email'];

  constructor(employeeService: EmployeeService) {
    super(employeeService);
  }
}
