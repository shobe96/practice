package com.example.employee.models;

import java.util.List;

public class DepartmentSearchResult {
	
	private List<Department> departments;
	private Long size;

	public List<Department> getDepartments() {
		return departments;
	}

	public void setDepartments(List<Department> departments) {
		this.departments = departments;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

}
