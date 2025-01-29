import { Department } from "./department.model";
import { Employee } from "./employee.model";
import { Skill } from "./skill.model";

export interface Project {
  [key: string]: number | string | undefined | Department | Date | Skill[] | Employee[];
  id?: number;
  name?: string;
  code?: string;
  skills?: Skill[];
  employees?: Employee[];
  department?: Department;
  startDate?: Date;
  endDate?: Date;
}
