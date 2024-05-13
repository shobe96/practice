import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectService } from '../../services/project/project.service';
import { Project } from '../../models/project.model';

export const projectResolver: ResolveFn<Project> = (route, state) => {
  const projectId: number = Number(route.paramMap.get('projectId')?.replace("$", ""));
  return inject(ProjectService).getProject(projectId);
};
