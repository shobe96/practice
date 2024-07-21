import { Skill } from "./skill.model";

export class SkillSearchResult {
  size?: number;
  skills?: Skill[];

  constructor(
    size?: number,
    skills?: Skill[]
  ) {
    this.size = size;
    this.skills = skills;
  }
}
