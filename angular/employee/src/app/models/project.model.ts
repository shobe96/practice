import { Department } from "./department.model";
import { Employee } from "./employee.model";
import { Skill } from "./skill.model";

export interface Project {
  id?: number;
  name?: string;
  code?: string;
  skills?: Skill[];
  employees?: Employee[];
  department?: Department;
  startDate?: Date;
  endDate?: Date;
}
