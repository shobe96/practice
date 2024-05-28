package com.example.employee.services;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.Role;
import com.example.employee.models.RoleSearchResult;

public interface RoleService {
	public RoleSearchResult getAllRoles(Pageable pageable);
	public RoleSearchResult getAllRoles();
	public Role getRoleById(Integer roleId); 
	public Role saveRole(Role role);
	public Role updateRole(Role role);
	public void deleteRole(Integer roleId);
	public RoleSearchResult searchRoles(String name, Pageable pageable);
}
