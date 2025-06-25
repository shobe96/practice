package com.example.employee.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EmployeeSearchResult {
	
	@JsonProperty("items")
	private List<Employee> employees;
	private Long size;

	public List<Employee> getEmployees() {
		return employees;
	}

	public void setEmployees(List<Employee> employees) {
		this.employees = employees;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

}
