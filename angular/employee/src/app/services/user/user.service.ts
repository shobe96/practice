import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '../../models/page-event.model';
import { UserSearchResult } from '../../models/user-search-result.model';
import { environment } from '../../../environments/environment.development';
import { buildPaginationParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/users"

  constructor(private http: HttpClient) { }

  public getAllUsers(page?: PageEvent) {

    return this.http.get<UserSearchResult>(`${this.backendURL}${this.baseUrl}?${buildPaginationParams(page)}`);
  }
}
