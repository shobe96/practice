import { Department } from "./department.model";
import { Employee } from "./employee.model";
import { Skill } from "./skill.model";

export class Project {
  id?: number;
  name: string = "";
  code: string = "";
  skills?: Skill[];
  employees?: Employee[];
  department?: Department;
  startDate?: Date;
  endDate?: Date;

  constructor(
    id?: number,
    skills?: Skill[],
    employees?: Employee[],
    department?: Department,
    startDate?: Date,
    endDate?: Date
  ) {
    this.id = id;
    this.skills = skills;
    this.employees = employees;
    this.department = department;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
