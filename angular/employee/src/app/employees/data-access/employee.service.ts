import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { Skill } from '../../skills/data-access/skill.model';
import { Department } from '../../departments/data-access/department.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';
import { SearchResult } from '../../shared/data-access/search-result.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends BaseCrudService<Employee> {

  baseUrl = "/api/employees";

  filterEmployeesByActiveAndSkills(skills: Skill[], department: Department): Observable<Employee[]> {
    return this.http.post<Employee[]>(`${this.backendURL}${this.baseUrl}/filter-by-active-and-skills/${department.id}`, skills);
  };

  findByUser(userId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.backendURL}${this.baseUrl}/find-by-user/${userId}`);
  }

  findByDepartment(departmentId: number, page: PageEvent): Observable<SearchResult<Employee>> {
    return this.http.get<SearchResult<Employee>>(`${this.backendURL}${this.baseUrl}/get-by-department/${departmentId}?page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }
}
