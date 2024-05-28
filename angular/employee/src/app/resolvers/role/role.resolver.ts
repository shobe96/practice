import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RoleService } from '../../services/role/role.service';
import { Role } from '../../models/role.model';

export const roleResolver: ResolveFn<Role> = (route, state) => {
  const roleId: number = Number(route.paramMap.get('roleId')?.replace("$", ""));
  return inject(RoleService).getRole(roleId);
};
