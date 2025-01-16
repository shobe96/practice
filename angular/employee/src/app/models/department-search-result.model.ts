import { Department } from "./department.model";

export interface DepartmentSearchResult {
  size?: number;
  departments?: Department[];
}
