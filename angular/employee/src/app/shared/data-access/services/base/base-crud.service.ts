import { inject } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageEvent } from '../../page-event.model';
import { Observable } from 'rxjs';
import { SearchResult } from '../../search-result.model';

export abstract class BaseCrudService<
  T extends object,
  C extends object = object
> {
  protected readonly backendURL = environment.BACKEND_URL;
  protected readonly http = inject(HttpClient);

  protected abstract readonly baseUrl: string;

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.backendURL}${this.baseUrl}`);
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
    return this.http.delete<void>(
      `${this.backendURL}${this.baseUrl}/delete/${id}`
    );
  }

  search(data: C, page?: PageEvent): Observable<SearchResult<T>> {
    let params = new HttpParams();

    params = this.appendParams(params, data);
    if (page) {
      params = this.appendParams(params, page);
    }
    return this.http.get<SearchResult<T>>(
      `${this.backendURL}${this.baseUrl}/search`,
      { params: params }
    );
  }

  private appendParams<T extends object>(
    params: HttpParams,
    obj: T
  ): HttpParams {
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          params = params.append(key, String(v));
        });
      } else {
        params = params.append(key, String(value));
      }
    });

    return params;
  }

  searchAll(data: C): Observable<T[]> {
    let params = new HttpParams();
    params = this.appendParams(params, data);
    return this.http.get<T[]>(`${this.backendURL}${this.baseUrl}/search`, {
      params: params,
    });
  }
}
