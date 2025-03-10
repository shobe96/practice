import { Employee } from "./employee.model";

export interface EmpoyeeSearchResult {
  size?: number;
  employees?: Employee[];
}
