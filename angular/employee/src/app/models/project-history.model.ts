import { Employee } from "./employee.model";
import { Project } from "./project.model";

export class ProjectHistory {
  id?: number;
  project?: Project;
  employee?: Employee;
  startDate?: Date;
  endDate?: Date;

  constructor(
    id?: number,
    project?: Project,
    employee?: Employee,
    startDate?: Date,
    endDate?: Date
  ) {
    this.id = id;
    this.project = project;
    this.employee = employee;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
