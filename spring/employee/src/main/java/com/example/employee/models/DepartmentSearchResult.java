package com.example.employee.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DepartmentSearchResult {
	
	@JsonProperty("items")
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
