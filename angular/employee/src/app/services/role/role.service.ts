import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '../../models/page-event.model';
import { Observable } from 'rxjs';
import { RoleSearchResult } from '../../models/role-search-result.model';
import { Role } from '../../models/role.model';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/roles";
  private _http: HttpClient = inject(HttpClient);

  getAllRoles(all: boolean, page?: PageEvent): Observable<RoleSearchResult> {
    const url =
      all ?
        `${this._backendURL}${this._baseUrl}?all=${all}` :
        `${this._backendURL}${this._baseUrl}?${buildPaginationParams(page)}&sort=asc&all=${all}`;
    return this._http.get<RoleSearchResult>(url);
  }

  search(roleSearch: Role, page: PageEvent): Observable<RoleSearchResult> {
    return this._http.get<RoleSearchResult>(`${this._backendURL}${this._baseUrl}/search?${buildSearchParams(roleSearch)}&page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }

  getRole(roleId: number): Observable<Role> {
    return this._http.get<Role>(`${this._backendURL}${this._baseUrl}/get-one/${roleId}`);
  }

  update(role: Role): Observable<Role> {
    return this._http.put<Role>(`${this._backendURL}${this._baseUrl}/update`, role);
  }
  save(role: Role): Observable<Role> {
    return this._http.post<Role>(`${this._backendURL}${this._baseUrl}/create`, role);
  }

  delete(roleId: number) {
    return this._http.delete<void>(`${this._backendURL}${this._baseUrl}/delete/${roleId}`);
  }
}
