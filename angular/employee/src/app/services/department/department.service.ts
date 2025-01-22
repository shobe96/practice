import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../../models/department.model';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DepartmentSearchResult } from '../../models/department-search-result.model';
import { PageEvent } from '../../models/page-event.model';
import { buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {


  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/departments"

  constructor(private http: HttpClient) { }

  public getAllDepartments(all: boolean, page?: PageEvent): Observable<DepartmentSearchResult> {
    if (all) {
      return this.http.get<DepartmentSearchResult>(`${this.backendURL}${this.baseUrl}?all=${all}`)
    } else {
      let queryParams: string = page?.page === undefined ? `` : `page=${page.page}`;
      queryParams += page?.rows === undefined ? `` : `&size=${page.rows}`;
      queryParams += ``;
      return this.http.get<DepartmentSearchResult>(`${this.backendURL}${this.baseUrl}?${queryParams}&sort=asc&all=${all}`)
    }
  }
  private errorHandler(errorRes: HttpErrorResponse) {
    let errorMessage = 'Error occurred!';
    return throwError(() => new Error(errorMessage));
  }

  search(departmentSearch: Department, page: PageEvent): Observable<DepartmentSearchResult> {
    return this.http.get<DepartmentSearchResult>(`${this.backendURL}${this.baseUrl}/search?${buildSearchParams(departmentSearch)}&page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }

  getDepartment(departmentId: number): Observable<Department> {
    return this.http.get<Department>(`${this.backendURL}${this.baseUrl}/get-one/${departmentId}`);
  }

  update(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.backendURL}${this.baseUrl}/update`, department);
  }
  save(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.backendURL}${this.baseUrl}/create`, department);
  }

  delete(departmentId: number) {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${departmentId}`);
  }
}
