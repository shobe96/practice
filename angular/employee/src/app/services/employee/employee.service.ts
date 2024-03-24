import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // mySub = new Subject<number>();
  // mySub1 = new BehaviorSubject<number>(1);

  constructor(private http: HttpClient) { }
}
