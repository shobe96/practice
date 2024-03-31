import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Employee } from '../../models/employee.model';
import { PaginatorState } from 'primeng/paginator';
import { EmployeeCreateResponse } from '../../models/employee-create-response.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/employees"

  // mySub = new Subject<number>();
  // mySub1 = new BehaviorSubject<number>(1);

  constructor(private http: HttpClient) { }

  public getAllEmpoloyees(page: PaginatorState): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.backendURL}${this.baseUrl}?page=${page.page}&size=${page.rows}&sort=asc`).pipe(catchError(this.errorHandler));
  }

  public getEmployeeCount(): Observable<number> {
    return this.http.get<number>(`${this.backendURL}${this.baseUrl}/count`).pipe(catchError(this.errorHandler));
  }

  public getEmployee(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.backendURL}${this.baseUrl}/get-one/${employeeId}`);
  }

  public save(employee: Employee | null): Observable<Employee> {
    return this.http.post<Employee>(`${this.backendURL}${this.baseUrl}/create`, employee);
  }

  public update(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.backendURL}${this.baseUrl}/update`, employee);
  }

  public delete(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${employeeId}`);
  }

  private errorHandler(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'Error occurred!';
    return throwError(() => new Error(errorMessage));
  }



}
