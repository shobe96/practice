import { Department } from "../models/department.model";
import { Employee } from "../models/employee.model";
import { PageEvent } from "../models/page-event.model";
import { Project } from "../models/project.model";
import { Role } from "../models/role.model";
import { Skill } from "../models/skill.model";
import { User } from "../models/user.model";

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


