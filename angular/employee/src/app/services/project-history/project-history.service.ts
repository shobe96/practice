import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProjectHistory } from '../../models/project-history.model';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectHistoryService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/project-history";
  private _http: HttpClient = inject(HttpClient);

  getProjectsHistoryOfEmployee(employeeId: number | undefined): Observable<ProjectHistory[]> {
    return this._http.get<ProjectHistory[]>(`${this._backendURL}${this._baseUrl}/${employeeId}`);
  }
}
