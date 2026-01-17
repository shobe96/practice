import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';
import { EmployeeSearchCriteria } from './employee-search.criteria';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends BaseCrudService<Employee, EmployeeSearchCriteria> {

  baseUrl = "/api/employees";

  findByUser(userId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.backendURL}${this.baseUrl}/find-by-user/${userId}`);
  }
}
