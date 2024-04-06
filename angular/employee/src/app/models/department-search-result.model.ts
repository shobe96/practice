import { Department } from "./department.model";

export class DepartmentSearchResult {
  size?: number;
  departments?: Department[];

  constructor(
    size?: number,
    departments?: Department[]
  ) {
    this.size = size;
    this.departments = departments;
  }
}
