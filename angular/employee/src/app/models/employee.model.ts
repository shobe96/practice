import { Department } from './department.model';
import { Skill } from './skill.model';
import { User } from './user.model';

export class Employee {
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

  constructor(
    id?: number,
    name?: string,
    surname?: string,
    addDate?: string,
    modDate?: string,
    addUser?: string,
    modUser?: string,
    active?: boolean,
    email?: string,
    department?: Department,
    skills?: Skill[],
    user?: User
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.addDate = addDate;
    this.modDate = modDate;
    this.addUser = addUser;
    this.modUser = modUser;
    this.active = active;
    this.email = email;
    this.department = department;
    this.skills = skills;
    this.user = user;
  }
}
