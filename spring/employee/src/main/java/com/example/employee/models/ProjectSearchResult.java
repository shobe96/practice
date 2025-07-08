package com.example.employee.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProjectSearchResult {
	
	@JsonProperty("items")
	private List<Project> projects;
	private Long size;

	public List<Project> getProjects() {
		return projects;
	}

	public void setProjects(List<Project> projects) {
		this.projects = projects;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}
}
