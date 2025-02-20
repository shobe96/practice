import { Employee } from "./employee.model";
import { Role } from "./role.model";

export interface RegisterRequest {
  username?: string;
  password?: string;
  roles?: Role[];
  employee?: Employee;
}
