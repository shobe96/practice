import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { BaseListFacade } from '../../shared/data-access/services/base/base-list.facade';

@Injectable()
export class ProjectListFacadeService extends BaseListFacade<Project> {

  protected override _search: Project = {};

  searchKeys = ['name', 'code'];

  constructor(projectService: ProjectService) {
    super(projectService);
  }
}
