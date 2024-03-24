import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private backendURL = environment.BACKEND_URL;

  // mySub = new Subject<number>();
  // mySub1 = new BehaviorSubject<number>(1);

  constructor(private http: HttpClient) {}

  public getAllEmpoloyees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.backendURL + '/api/employees');
  }
}
