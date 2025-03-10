import { Employee } from "../../employees/data-access/employee.model";
import { Role } from "../../roles/data-access/role.model";

export interface RegisterRequest {
  username?: string;
  password?: string;
  roles?: Role[];
  employee?: Employee;
}
