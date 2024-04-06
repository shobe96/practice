import { ResolveFn } from '@angular/router';
import { Department } from '../../models/department.model';
import { inject } from '@angular/core';
import { DepartmentService } from '../../services/department/department.service';

export const departmentResolver: ResolveFn<Department> = (route, state) => {
  const departmentId: number = Number(route.paramMap.get('departmentId')?.replace("$", ""));
  return inject(DepartmentService).getDepartment(departmentId);
};
