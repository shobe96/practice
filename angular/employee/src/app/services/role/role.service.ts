import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '../../models/page-event.model';
import { Observable } from 'rxjs';
import { RoleSearchResult } from '../../models/role-search-result.model';
import { Role } from '../../models/role.model';
import { buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/roles"

  constructor(private http: HttpClient) { }

  public getAllRoles(all: boolean, page?: PageEvent): Observable<RoleSearchResult> {
    if (all) {
      return this.http.get<RoleSearchResult>(`${this.backendURL}${this.baseUrl}?all=${all}`)
    } else {
      let queryParams: string = page?.page === undefined ? `` : `page=${page.page}`;
      queryParams += page?.rows === undefined ? `` : `&size=${page.rows}`;
      queryParams += ``;
      return this.http.get<RoleSearchResult>(`${this.backendURL}${this.baseUrl}?${queryParams}&sort=asc&all=${all}`)
    }


  }

  search(roleSearch: Role, page: PageEvent): Observable<RoleSearchResult> {
    return this.http.get<RoleSearchResult>(`${this.backendURL}${this.baseUrl}/search?${buildSearchParams(roleSearch)}&page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }

  getRole(roleId: number): Observable<Role> {
    return this.http.get<Role>(`${this.backendURL}${this.baseUrl}/get-one/${roleId}`);
  }

  update(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.backendURL}${this.baseUrl}/update`, role);
  }
  save(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.backendURL}${this.baseUrl}/create`, role);
  }

  delete(roleId: number) {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${roleId}`);
  }
}
