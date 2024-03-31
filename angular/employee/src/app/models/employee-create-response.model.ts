import { Employee } from "./employee.model";

export class EmployeeCreateResponse {
  employee: Employee;
  redirectUrl: string;

  constructor(employee: Employee,
    redirectUrl: string) {
    this.employee = employee;
    this.redirectUrl = redirectUrl;
  }
}
