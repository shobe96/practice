import { ResolveFn } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { inject } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';

export const employeeResolver: ResolveFn<Employee> = (route, state) => {
  const employeeId: number =  Number(route.paramMap.get('employeeId')?.replace("$", ""));
  return inject(EmployeeService).getEmployee(employeeId);
};
