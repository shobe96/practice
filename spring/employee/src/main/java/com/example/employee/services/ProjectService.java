package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.Project;
import com.example.employee.models.ProjectSearchResult;

public interface ProjectService {
	public ProjectSearchResult getAllProjects(Pageable pageable);
	public List<Project> getAllProjects();
	public Project getProjectbyId(Integer projectId); 
	public Project saveProject(Project project);
	public Project updateProject(Project project);
	public void deleteProject(Integer projectId);
	public ProjectSearchResult searcProjects(String name, Pageable pageable);
}
