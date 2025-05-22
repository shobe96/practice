import { Employee } from "./employee.model";

export interface EmployeeSearchResult {
  size?: number;
  employees?: Employee[];
}
