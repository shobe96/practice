import { Injectable } from '@angular/core';
import { ProjectHistory } from './project-history.model';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../../shared/data-access/services/base/base-crud.service';
import { ProjecetHistorySearchCriteria } from './project-history-search.criteria';

@Injectable({
  providedIn: 'root'
})
export class ProjectHistoryService extends BaseCrudService<ProjectHistory, ProjecetHistorySearchCriteria>{

  baseUrl = "/api/project-history";

  getProjectsHistoryOfEmployee(employeeId: number | undefined): Observable<ProjectHistory[]> {
    return this.http.get<ProjectHistory[]>(`${this.backendURL}${this.baseUrl}/${employeeId}`);
  }
}
