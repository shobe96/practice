import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';
import { ProjectSearchCriteria } from './project-search.criteria';

@Injectable()
export class ProjectListFacadeService extends BaseListFacade<Project, ProjectSearchCriteria> {

  protected override _search: Project = {};

  searchKeys = ['name', 'code', 'employeeId', 'phEmployeeId', 'active'];

  constructor(projectService: ProjectService) {
    super(projectService);
  }
}
