import { Employee } from "./employee.model";
import { Project } from "./project.model";

export interface ProjectHistory {
  id?: number;
  project?: Project;
  employee?: Employee;
  startDate?: Date;
  endDate?: Date;
}
