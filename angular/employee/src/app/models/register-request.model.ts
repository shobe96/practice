import { Employee } from "./employee.model";
import { Role } from "./role.model";

export class RegisterRequest {
  username?: string;
  password?: string;
  roles?: Role[];
  employee?: Employee;

  constructor(
    username?: string,
    password?: string,
    roles?: Role[],
    employee?: Employee
  ) {
    this.username = username;
    this.password = password;
    this.roles = roles;
    this.employee = employee;
  }
}
