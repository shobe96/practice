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
  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/employees";

  private http: HttpClient = inject(HttpClient);

  public getAllEmployees(all: boolean, page?: PageEvent): Observable<EmployeeSearchResult> {
    const url =
      all
        ? `${this.backendURL}${this.baseUrl}?all=${all}` :
        `${this.backendURL}${this.baseUrl}?${buildPaginationParams(page)}&sort=asc&all=${all}`;
    return this.http.get<EmployeeSearchResult>(url);
  }

  public getEmployee(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.backendURL}${this.baseUrl}/get-one/${employeeId}`);
  }

  public save(employee: Employee | null): Observable<Employee> {
    return this.http.post<Employee>(`${this.backendURL}${this.baseUrl}/create`, employee);
  }

  public update(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.backendURL}${this.baseUrl}/update`, employee);
  }

  public delete(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${employeeId}`);
  }

  public search(employee: Employee, page: PageEvent): Observable<EmployeeSearchResult> {
    return this.http.get<EmployeeSearchResult>(`${this.backendURL}${this.baseUrl}/search?${buildSearchParams(employee)}&${buildPaginationParams(page)}`);
  }

  public filterEmployeesByActiveAndSkills(skills: Skill[], department: Department): Observable<Employee[]> {
    return this.http.post<Employee[]>(`${this.backendURL}${this.baseUrl}/filter-by-active-and-skills/${department.id}`, skills);
  };

  public findByUser(userId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.backendURL}${this.baseUrl}/find-by-user/${userId}`);
  }

  public findByDepartment(departmentId: number, page: PageEvent): Observable<EmployeeSearchResult> {
    return this.http.get<EmployeeSearchResult>(`${this.backendURL}${this.baseUrl}/get-by-department/${departmentId}?page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }
}
