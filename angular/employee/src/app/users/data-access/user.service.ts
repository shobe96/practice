import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageEvent } from '../../shared/data-access/page-event.model';
import { UserSearchResult } from './user-search-result.model';
import { environment } from '../../../environments/environment.development';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/users"
  private _http = inject(HttpClient);

  getAllUsers(page?: PageEvent): Observable<UserSearchResult> {
    return this._http.get<UserSearchResult>(`${this._backendURL}${this._baseUrl}?${buildPaginationParams(page)}`);
  }

  search(user: User, page: PageEvent): Observable<UserSearchResult> {
    return this._http.get<UserSearchResult>(`${this._backendURL}${this._baseUrl}/search?${buildSearchParams(user)}&${buildPaginationParams(page)}`);
  }
}
