import { Project } from "./project.model";

export class ProjectSearchResult {
  size?: number;
  projects?: Project[];

  constructor(
    size?: number,
    projects?: Project[]
  ) {
    this.projects = projects;
    this.size = size;
  }
}
