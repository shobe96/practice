package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.Project;
import com.example.employee.utils.SearchResult;

public interface ProjectService {
	public SearchResult<Project> getAllProjects(Pageable pageable);
	public List<Project> getAllProjects();
	public Project getProjectbyId(Integer projectId); 
	public Project saveProject(Project project);
	public Project updateProject(Project project);
	public void deleteProject(Integer projectId);
	public SearchResult<Project> searcProjects(String name, String code,Pageable pageable);
	public void unassignEmployee(Integer employeeId, Project project);
	public List<Project> getProjectsByEmployee(Integer employeeId);
	public Project getByEmployeeId(Integer employeeId);
}
