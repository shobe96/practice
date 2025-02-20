import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Employee } from '../../models/employee.model';
import { EmployeeSearchResult } from '../../models/employee-search-result.model';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';
import { PageEvent } from '../../models/page-event.model';
import { Skill } from '../../models/skill.model';
import { Department } from '../../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/employees";
  private _http: HttpClient = inject(HttpClient);

  getAllEmployees(all: boolean, page?: PageEvent): Observable<EmployeeSearchResult> {
    const url =
      all
        ? `${this._backendURL}${this._baseUrl}?all=${all}` :
        `${this._backendURL}${this._baseUrl}?${buildPaginationParams(page)}&sort=asc&all=${all}`;
    return this._http.get<EmployeeSearchResult>(url);
  }

  getEmployee(employeeId: number): Observable<Employee> {
    return this._http.get<Employee>(`${this._backendURL}${this._baseUrl}/get-one/${employeeId}`);
  }

  save(employee: Employee | null): Observable<Employee> {
    return this._http.post<Employee>(`${this._backendURL}${this._baseUrl}/create`, employee);
  }

  update(employee: Employee): Observable<Employee> {
    return this._http.put<Employee>(`${this._backendURL}${this._baseUrl}/update`, employee);
  }

  delete(employeeId: number): Observable<void> {
    return this._http.delete<void>(`${this._backendURL}${this._baseUrl}/delete/${employeeId}`);
  }

  search(employee: Employee, page: PageEvent): Observable<EmployeeSearchResult> {
    return this._http.get<EmployeeSearchResult>(`${this._backendURL}${this._baseUrl}/search?${buildSearchParams(employee)}&${buildPaginationParams(page)}`);
  }

  filterEmployeesByActiveAndSkills(skills: Skill[], department: Department): Observable<Employee[]> {
    return this._http.post<Employee[]>(`${this._backendURL}${this._baseUrl}/filter-by-active-and-skills/${department.id}`, skills);
  };

  findByUser(userId: number): Observable<Employee> {
    return this._http.get<Employee>(`${this._backendURL}${this._baseUrl}/find-by-user/${userId}`);
  }

  findByDepartment(departmentId: number, page: PageEvent): Observable<EmployeeSearchResult> {
    return this._http.get<EmployeeSearchResult>(`${this._backendURL}${this._baseUrl}/get-by-department/${departmentId}?page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }
}
