import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '../../models/page-event.model';
import { Observable } from 'rxjs';
import { RoleSearchResult } from '../../models/role-search-result.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/roles"

  constructor(private http: HttpClient) { }

  public getAllRoles(all: boolean, page?: PageEvent): Observable<RoleSearchResult> {
    return this.http.get<RoleSearchResult>(`${this.backendURL}${this.baseUrl}?all=${all}`);
  }
}
