import { Department } from "../../departments/data-access/department.model";
import { Employee } from "../../employees/data-access/employee.model";
import { Skill } from "../../skills/data-access/skill.model";

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
