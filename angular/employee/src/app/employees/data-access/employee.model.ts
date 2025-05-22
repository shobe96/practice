import { Department } from '../../departments/data-access/department.model';
import { Skill } from '../../skills/data-access/skill.model';
import { User } from '../../users/data-access/user.model';

export interface Employee {
  [key: string]: number | string | boolean | undefined | Department | User | Skill[];
  id?: number;
  name?: string;
  surname?: string;
  addDate?: string;
  modDate?: string;
  addUser?: string;
  modUser?: string;
  active?: boolean;
  email?: string;
  department?: Department;
  skills?: Skill[];
  user?: User;
}
