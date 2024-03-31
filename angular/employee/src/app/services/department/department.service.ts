import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Department } from '../../models/department.model';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/departments"

  constructor(private http: HttpClient) { }

  public getAllDepartments(all: boolean, page?: PaginatorState): Observable<Department[]> {
    if (all) {
      return this.http.get<Department[]>(this.backendURL + this.baseUrl + `?all=${all}`).pipe(catchError(this.errorHandler));
    } else {
      let queryParams: string=page?.page === undefined ? `` : `page=${page.page}`;
      queryParams+=page?.rows === undefined ? `` : `&size=${page.rows}`;
      queryParams+=``;
      return this.http.get<Department[]>(this.backendURL + this.baseUrl + `?${queryParams}&sort=asc&all=${all}`).pipe(catchError(this.errorHandler));
    }
  }
  private errorHandler(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'Error occurred!';
    return throwError(() => new Error(errorMessage));
  }


}
