import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Employee } from '../../models/employee.model';
import { EmployeeSearchResult } from '../../models/employee-search-result.model';
import { buildSearchParams } from '../../shared/utils';
import { PageEvent } from '../../models/page-event.model';
import { Skill } from '../../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/employees"

  // mySub = new Subject<number>();
  // mySub1 = new BehaviorSubject<number>(1);

  constructor(private http: HttpClient) { }

  public getAllEmployees(all: boolean, page?: PageEvent): Observable<EmployeeSearchResult> {
    if (all) {
      return this.http.get<EmployeeSearchResult>(`${this.backendURL}${this.baseUrl}?all=${all}`)
    } else {
      let queryParams: string = page?.page === undefined ? `` : `page=${page.page}`;
      queryParams += page?.rows === undefined ? `` : `&size=${page.rows}`;
      queryParams += ``;
      return this.http.get<EmployeeSearchResult>(`${this.backendURL}${this.baseUrl}?${queryParams}&sort=asc&all=${all}`)
    }
    // .pipe(catchError(this.errorHandler));
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
    return this.http.get<EmployeeSearchResult>(`${this.backendURL}${this.baseUrl}/search?${buildSearchParams(employee)}&page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }

  public filterEmployeesByActiveAndSkills(skills: Skill[]): Observable<Employee[]> {
    return this.http.post<Employee[]>(`${this.backendURL}${this.baseUrl}/filter-by-active-and-skills`, skills);
  };

  private errorHandler(errorRes: any) {
    console.log(errorRes);
    let errorMessage = 'Error occurred!';
    return throwError(() => new Error(errorMessage));
  }

}
