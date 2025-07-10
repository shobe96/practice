package com.example.employee.services;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.Role;
import com.example.employee.utils.SearchResult;


public interface RoleService {
	public SearchResult<Role> getAllRoles(Pageable pageable);
	public SearchResult<Role> getAllRoles();
	public Role getRoleById(Integer roleId); 
	public Role saveRole(Role role);
	public Role updateRole(Role role);
	public void deleteRole(Integer roleId);
	public SearchResult<Role> searchRoles(String name, Pageable pageable);
}
