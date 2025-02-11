import { Employee } from "./employee.model";

export interface EmployeeCreateResponse {
  employee: Employee;
  redirectUrl: string;
}
