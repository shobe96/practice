import { Department } from "./department.model";
import { Employee } from "./employee.model";
import { Skill } from "./skill.model";

export class Project {
  id?: number;
  name?: string;
  code?: string;
  skills?: Skill[];
  employees?: Employee[];
  department?: Department;

  constructor(
    id?: number,
    name?: string,
    code?: string,
    skills?: Skill[],
    employees?: Employee[],
    department?: Department
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.skills = skills;
    this.employees = employees;
    this.department = department;
  }
}
