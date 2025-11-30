package com.example.employee.services;

import com.example.employee.models.Project;

public interface ProjectService extends BaseService<Project, Integer>{
//	public SearchResult<Project> getAllProjects(Pageable pageable);
//	public List<Project> getAllProjects();
//	public Project getProjectbyId(Integer projectId); 
//	public Project saveProject(Project project);
//	public Project updateProject(Project project);
//	public void deleteProject(Integer projectId);
//	public SearchResult<Project> searcProjects(String name, String code,Pageable pageable);
	public void unassignEmployee(Integer employeeId, Project project);
//	public List<Project> getProjectsByEmployee(Integer employeeId);
//	public Project getByEmployeeId(Integer employeeId);
}
