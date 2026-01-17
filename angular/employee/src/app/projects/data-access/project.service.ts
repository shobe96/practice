import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';
import { ProjectSearchCriteria } from './project-search.criteria';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseCrudService<Project, ProjectSearchCriteria> {

  baseUrl = "/api/projects";

  unassignEmployee(employeeId: number, project: Project) {
    return this.http.post<void>(`${this.backendURL}${this.baseUrl}/unassign-employee/${employeeId}`, project);
  }

  getEmployeeProjectHisotry(employeeId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.backendURL}${this.baseUrl}/history/${employeeId}`);
  }
  getProjectByEmployee(employeeId: number): Observable<Project> {
    return this.http.get<Project>(`${this.backendURL}${this.baseUrl}/get-project/${employeeId}`);
  }
}
