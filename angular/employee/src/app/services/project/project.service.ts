import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PageEvent } from '../../models/page-event.model';
import { ProjectSearchResult } from '../../models/project-search-result.model';
import { Project } from '../../models/project.model';
import { buildPaginationParams, buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private _backendURL = environment.BACKEND_URL;
  private _baseUrl = "/api/projects";
  private _http: HttpClient = inject(HttpClient);

  getAllProjects(all: boolean, page?: PageEvent): Observable<ProjectSearchResult> {
    const url =
      all ?
        `${this._backendURL}${this._baseUrl}?all=${all}` :
        `${this._backendURL}${this._baseUrl}?${buildPaginationParams(page)}&sort=asc&all=${all}`;
    return this._http.get<ProjectSearchResult>(url);
  }

  getProject(projectd: number): Observable<Project> {
    return this._http.get<Project>(`${this._backendURL}${this._baseUrl}/get-one/${projectd}`);
  }

  save(project: Project | null): Observable<Project> {
    return this._http.post<Project>(`${this._backendURL}${this._baseUrl}/create`, project);
  }

  update(project: Project): Observable<Project> {
    return this._http.put<Project>(`${this._backendURL}${this._baseUrl}/update`, project);
  }

  search(project: Project, page: PageEvent): Observable<ProjectSearchResult> {
    return this._http.get<ProjectSearchResult>(`${this._backendURL}${this._baseUrl}/search?${buildSearchParams(project)}&page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }

  delete(projectId: number): Observable<void> {
    return this._http.delete<void>(`${this._backendURL}${this._baseUrl}/delete/${projectId}`);
  }

  unassignEmployee(employeeId: number, project: Project) {
    return this._http.post<void>(`${this._backendURL}${this._baseUrl}/unassign-employee/${employeeId}`, project);
  }

  getEmployeeProjectHisotry(employeeId: number): Observable<Project[]> {
    return this._http.get<Project[]>(`${this._backendURL}${this._baseUrl}/history/${employeeId}`);
  }
  getProjectByEmployee(employeeId: number): Observable<Project> {
    return this._http.get<Project>(`${this._backendURL}${this._baseUrl}/get-project/${employeeId}`);
  }
}
