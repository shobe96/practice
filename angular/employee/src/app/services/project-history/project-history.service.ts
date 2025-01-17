import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectHistory } from '../../models/project-history.model';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectHistoryService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/project-history"

  constructor(private http: HttpClient) { }

  public getProjectsHistoryOfEmployee(employeeId: number | undefined): Observable<ProjectHistory[]> {
    return this.http.get<ProjectHistory[]>(`${this.backendURL}${this.baseUrl}/${employeeId}`);
  }
}
