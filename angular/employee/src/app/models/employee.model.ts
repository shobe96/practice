import { Department } from './department.model';
import { Skill } from './skill.model';
import { User } from './user.model';

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
