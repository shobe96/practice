import { PageEvent } from "../../shared/data-access/page-event.model";
import { Employee } from "./employee.model";

export interface EmployeeState {
  employees: Employee[],
  page: PageEvent,
  rowsPerPage:
  number[],
  loading: boolean
}
