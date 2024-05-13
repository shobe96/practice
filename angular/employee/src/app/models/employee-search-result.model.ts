import { Employee } from "./employee.model";

export class EmployeeSearchResult {
  size?: number;
  employees?: Employee[];

  constructor(
    size?: number,
    employees?: Employee[]
  ) {
    this.employees = employees;
    this.size = size;
  }
}
