import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PageEvent } from '../../models/page-event.model';
import { ProjectSearchResult } from '../../models/project-search-result.model';
import { Project } from '../../models/project.model';
import { buildSearchParams } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/projects"

  constructor(private http: HttpClient) { }

  public getAllProjects(all: boolean, page?: PageEvent): Observable<ProjectSearchResult> {
    if (all) {
      return this.http.get<ProjectSearchResult>(`${this.backendURL}${this.baseUrl}?all=${all}`)
    } else {
      let queryParams: string = page?.page === undefined ? `` : `page=${page.page}`;
      queryParams += page?.rows === undefined ? `` : `&size=${page.rows}`;
      queryParams += ``;
      return this.http.get<ProjectSearchResult>(`${this.backendURL}${this.baseUrl}?${queryParams}&sort=asc&all=${all}`)
    }
  }

  public getProject(projectd: number): Observable<Project> {
    return this.http.get<Project>(`${this.backendURL}${this.baseUrl}/get-one/${projectd}`);
  }

  public save(project: Project | null): Observable<Project> {
    return this.http.post<Project>(`${this.backendURL}${this.baseUrl}/create`, project);
  }

  public update(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.backendURL}${this.baseUrl}/update`, project);
  }

  public search(project: Project, page: PageEvent): Observable<ProjectSearchResult> {
    return this.http.get<ProjectSearchResult>(`${this.backendURL}${this.baseUrl}/search?${buildSearchParams(project)}&page=${page.page}&size=${page.rows}&sort=${page.sort}`);
  }

  public delete(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${projectId}`);
  }

  public unassignEmployee(employeeId: number, project: Project) {
    return this.http.post<void>(`${this.backendURL}${this.baseUrl}/unassign-employee/${employeeId}`, project);
  }
}
