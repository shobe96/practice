import { MenuItem } from "primeng/api";
import { Employee } from "../../employees/data-access/employee.model";
import { Role } from "../../roles/data-access/role.model";

export interface AuthState {
  employees: Employee[],
  roles: Role[],
  menuItems: MenuItem[],
  loading: boolean
}
