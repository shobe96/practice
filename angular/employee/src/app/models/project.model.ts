import { Skill } from "./skill.model";

export class Project {
  id?: number;
  name?: string;
  code?: string;
  skills?: Skill[];

  constructor(
    id?: number,
    name?: string,
    code?: string,
    skills?: Skill[]
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.skills = skills;
  }
}
