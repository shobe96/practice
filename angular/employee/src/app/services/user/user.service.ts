import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '../../models/page-event.model';
import { UserSearchResult } from '../../models/user-search-result.model';
import { environment } from '../../../environments/environment.development';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/users"

  constructor(private http: HttpClient) { }

  public getAllUsers(page?: PageEvent): Observable<UserSearchResult> {
    return this.http.get<UserSearchResult>(`${this.backendURL}${this.baseUrl}?${buildPaginationParams(page)}`);
  }

  public search(user: User, page: PageEvent): Observable<UserSearchResult> {
    return this.http.get<UserSearchResult>(`${this.backendURL}${this.baseUrl}/search?${buildSearchParams(user)}${buildPaginationParams(page)}`);
  }
}
