import { Department } from "../departments/data-access/department.model";
import { Employee } from "../employees/data-access/employee.model";
import { PageEvent } from "./data-access/page-event.model";
import { Project } from "../projects/data-access/project.model";
import { Role } from "../roles/data-access/role.model";
import { Skill } from "../skills/data-access/skill.model";
import { User } from "../users/data-access/user.model";

type SearchType = Department | Employee | Project | Role | Skill | User

export function buildSearchParams(object: SearchType): string {
  let params = "";
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const value = object[key as keyof SearchType];
    const nextValue = object[nextKey as keyof SearchType];
    if (value) {
      params += `${keys[i]}=${value}`;
      if ((i + 1) !== keys.length && nextValue) {
        params += `&`;
      }
    }
  }
  return params;
}

export function buildPaginationParams(page?: PageEvent): string {
  let queryParams: string = !page?.page ? `page=0` : `page=${page.page}`;
  queryParams += !page?.rows ? `` : `&size=${page.rows}`;
  return queryParams;
}


