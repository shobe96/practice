import { Employee } from "../../employees/data-access/employee.model";
import { ProjectHistory } from "../../projects/data-access/project-history.model";
import { Project } from "../../projects/data-access/project.model";
import { Role } from "../../roles/data-access/role.model";
import { PageEvent } from "../../shared/data-access/page-event.model";

export interface HomeState {
  roles: Role[],
  page: PageEvent,
  projectsHistory: ProjectHistory[],
  employee: Employee,
  departmentEmployees:
  Employee[],
  activeProject: Project,
  loading: boolean
}
