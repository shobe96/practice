import { inject } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '../../page-event.model';
import { buildPaginationParams, buildSearchParams } from '../../../utils';
import { Observable } from 'rxjs';

export abstract class BaseCrudService<T extends object, U> {

  protected readonly backendURL = environment.BACKEND_URL;
  protected readonly http = inject(HttpClient);

  protected abstract readonly baseUrl: string;

  getAll(all: boolean, page?: PageEvent): Observable<U> {
    const url =
      all
        ? `${this.backendURL}${this.baseUrl}?all=${all}` :
        `${this.backendURL}${this.baseUrl}?${buildPaginationParams(page)}&sort=asc&all=${all}`;
    return this.http.get<U>(url);
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.backendURL}${this.baseUrl}/get-one/${id}`);
  }

  create(data: T | null): Observable<T> {
    return this.http.post<T>(`${this.backendURL}${this.baseUrl}/create`, data);
  }

  update(data: T): Observable<T> {
    return this.http.put<T>(`${this.backendURL}${this.baseUrl}/update`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${id}`);
  }

  search(data: T, page: PageEvent): Observable<U> {
    return this.http.get<U>(`${this.backendURL}${this.baseUrl}/search?${buildSearchParams(data)}&${buildPaginationParams(page)}`);
  }
}
