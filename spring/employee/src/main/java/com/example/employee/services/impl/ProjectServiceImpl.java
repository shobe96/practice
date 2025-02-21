package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Employee;
import com.example.employee.models.Project;
import com.example.employee.models.ProjectHistory;
import com.example.employee.models.ProjectSearchResult;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.repositories.ProjectHistoryRepository;
import com.example.employee.repositories.ProjectRepository;
import com.example.employee.services.ProjectService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

	private ProjectRepository projectRepository;
	private EmployeeRepository employeeRepository;
	private ProjectHistoryRepository projectHistoryRepository;

	@Autowired
	public ProjectServiceImpl(ProjectRepository projectRepository, EmployeeRepository employeeRepository,
			ProjectHistoryRepository projectHistoryRepository) {
		this.projectRepository = projectRepository;
		this.employeeRepository = employeeRepository;
		this.projectHistoryRepository = projectHistoryRepository;
	}

	@Override
	public ProjectSearchResult getAllProjects(Pageable pageable) {
		ProjectSearchResult projectSearchResult = new ProjectSearchResult();
		List<Project> projects = projectRepository.findAllByActive(true, pageable).getContent();
		if (projects.isEmpty()) {
			Pageable newPage = PageRequest.of((pageable.getPageNumber() - 1), pageable.getPageSize());
			projects = projectRepository.findAllByActive(true, newPage).getContent();
		}
		projectSearchResult.setSize(projectRepository.countAllActiveProjects());
		projectSearchResult.setProjects(projects);
		return projectSearchResult;
	}

	@Override
	public List<Project> getAllProjects() {
		List<Project> projects = new ArrayList<>();
		projectRepository.findAllByActive(true).forEach(projects::add);
		return projects;
	}

	@Override
	public Project getProjectbyId(Integer projectId) {
		Optional<Project> optional = projectRepository.findById(projectId);
		if (optional.isPresent()) {
			return optional.get();
		} else {
			return null;
		}
	}

	@Override
	public Project saveProject(Project project) {
		for (Employee employee : project.getEmployees()) {
			employee.setActive(true);
			employee.setAssignmentDate(new Date());
			employeeRepository.save(employee);
		}
		return projectRepository.save(project);
	}

	@Override
	public Project updateProject(Project project) {
		return projectRepository.save(project);
	}

	@Override
	public void deleteProject(Integer projectId) {
		Project project = getProjectbyId(projectId);
		List<Employee> employees = new ArrayList<>(project.getEmployees());
		if (!employees.isEmpty()) {
			for (Employee employee : employees) {
				employee.setActive(false);
				employeeRepository.save(employee);
				unassignEmployee(employee, project);
			}
		}

		project.setActive(false);
		projectRepository.save(project);

	}

	@Override
	public ProjectSearchResult searcProjects(String name, Pageable pageable) {
		if (name == null) {
			name = "";
		}
		ProjectSearchResult projectSearchResult = new ProjectSearchResult();
		List<Project> employees = projectRepository.searchProjects(name, pageable).getContent();
		projectSearchResult.setProjects(employees);
		projectSearchResult.setSize(projectRepository.searchResultCount(name));
		return projectSearchResult;
	}

	@Override
	public void unassignEmployee(Integer employeeId, Project project) {
		for (Employee employee : project.getEmployees()) {
			if (employee.getId().equals(employeeId)) {
				project.getEmployees().remove(employee);
				projectRepository.save(project);
				employee.setActive(false);
				employeeRepository.save(employee);
				ProjectHistory projectHistory = new ProjectHistory();
				projectHistory.setEmployee(employee);
				projectHistory.setProject(project);
				projectHistory.setStartDate(employee.getAssignmentDate());
				projectHistory.setEndDate(new Date());
				projectHistoryRepository.save(projectHistory);
				break;
			}
		}

	}

	@Override
	public List<Project> getProjectsByEmployee(Integer employeeId) {
		return projectRepository.findAllByEmployee(employeeId);
	}

	public void unassignEmployee(Employee employee, Project project) {
		project.getEmployees().remove(employee);
		projectRepository.save(project);
		employee.setActive(false);
		employeeRepository.save(employee);
		ProjectHistory projectHistory = new ProjectHistory();
		projectHistory.setEmployee(employee);
		projectHistory.setProject(project);
		projectHistory.setStartDate(employee.getAssignmentDate());
		projectHistory.setEndDate(new Date());
		projectHistoryRepository.save(projectHistory);
	}

	@Override
	public Project getByEmployeeId(Integer employeeId) {
		return projectRepository.findByEmployeeId(employeeId);
	}
}
