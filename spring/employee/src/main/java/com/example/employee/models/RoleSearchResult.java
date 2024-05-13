package com.example.employee.models;

import java.util.List;

public class RoleSearchResult {

	private List<Role> roles;
	private Long size;

	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

}
