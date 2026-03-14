import { Skill } from "../../skills/data-access/skill.model";

export interface EmployeeSearchCriteria {
  name?: string;
  surname?: string;
  email?: string;
  departmentId?: number;
  userId?: number;
  active?: boolean;
  skillIds?: number[];
  withoutUser?: boolean;
}
