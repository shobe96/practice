import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../../models/department.model';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DepartmentSearchResult } from '../../models/department-search-result.model';
import { PageEvent } from '../../models/page-event.model';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/departments"

  constructor(private http: HttpClient) { }

  getAllDepartments(all: boolean, page?: PageEvent): Observable<DepartmentSearchResult> {
    if (all) {
      return this.http.get<DepartmentSearchResult>(`${this._backendURL}${this._baseUrl}?all=${all}`)
    } else {
      let queryParams: string = page?.page === undefined ? `` : `page=${page.page}`;
      queryParams += page?.rows === undefined ? `` : `&size=${page.rows}`;
      queryParams += ``;
      return this.http.get<DepartmentSearchResult>(`${this._backendURL}${this._baseUrl}?${queryParams}&sort=asc&all=${all}`)
    }
  }

  search(departmentSearch: Department, page: PageEvent): Observable<DepartmentSearchResult> {
    return this.http.get<DepartmentSearchResult>(`${this._backendURL}${this._baseUrl}/search?${buildSearchParams(departmentSearch)}&${buildPaginationParams(page)}`);
  }

  getDepartment(departmentId: number): Observable<Department> {
    return this.http.get<Department>(`${this._backendURL}${this._baseUrl}/get-one/${departmentId}`);
  }

  update(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this._backendURL}${this._baseUrl}/update`, department);
  }
  save(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this._backendURL}${this._baseUrl}/create`, department);
  }

  delete(departmentId: number) {
    return this.http.delete<void>(`${this._backendURL}${this._baseUrl}/delete/${departmentId}`);
  }
}
