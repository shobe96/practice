import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Department } from './department.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DepartmentSearchResult } from './department-search-result.model';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/departments";
  private _http = inject(HttpClient);

  getAllDepartments(all: boolean, page?: PageEvent): Observable<DepartmentSearchResult> {
    if (all) {
      return this._http.get<DepartmentSearchResult>(`${this._backendURL}${this._baseUrl}?all=${all}`)
    } else {
      let queryParams: string = page?.page === undefined ? `` : `page=${page.page}`;
      queryParams += page?.rows === undefined ? `` : `&size=${page.rows}`;
      queryParams += ``;
      return this._http.get<DepartmentSearchResult>(`${this._backendURL}${this._baseUrl}?${queryParams}&sort=asc&all=${all}`)
    }
  }

  search(departmentSearch: Department, page: PageEvent): Observable<DepartmentSearchResult> {
    return this._http.get<DepartmentSearchResult>(`${this._backendURL}${this._baseUrl}/search?${buildSearchParams(departmentSearch)}&${buildPaginationParams(page)}`);
  }

  getDepartment(departmentId: number): Observable<Department> {
    return this._http.get<Department>(`${this._backendURL}${this._baseUrl}/get-one/${departmentId}`);
  }

  update(department: Department): Observable<Department> {
    return this._http.put<Department>(`${this._backendURL}${this._baseUrl}/update`, department);
  }
  save(department: Department): Observable<Department> {
    return this._http.post<Department>(`${this._backendURL}${this._baseUrl}/create`, department);
  }

  delete(departmentId: number) {
    return this._http.delete<void>(`${this._backendURL}${this._baseUrl}/delete/${departmentId}`);
  }
}
