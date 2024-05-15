import { Employee } from "./employee.model";
import { Skill } from "./skill.model";

export class Project {
  id?: number;
  name?: string;
  code?: string;
  skills?: Skill[];
  employees?: Employee[];

  constructor(
    id?: number,
    name?: string,
    code?: string,
    skills?: Skill[],
    employees?: Employee[]
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.skills = skills;
    this.employees = employees;
  }
}
