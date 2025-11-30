package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Service;
import com.example.employee.models.Employee;
import com.example.employee.models.Project;
import com.example.employee.models.ProjectHistory;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.repositories.ProjectHistoryRepository;
import com.example.employee.repositories.ProjectRepository;
import com.example.employee.services.ProjectService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProjectServiceImpl extends BaseServiceImpl<Project, Integer> implements ProjectService {

	private ProjectRepository projectRepository;
	private EmployeeRepository employeeRepository;
	private ProjectHistoryRepository projectHistoryRepository;
	
	@Override
	protected JpaRepository<Project, Integer> getRepository() {
		return projectRepository;
	}

	@Override
	protected JpaSpecificationExecutor<Project> getSpecificationExecutor() {
		return projectRepository;
	}

	public ProjectServiceImpl(ProjectRepository projectRepository, EmployeeRepository employeeRepository,
			ProjectHistoryRepository projectHistoryRepository) {
		this.projectRepository = projectRepository;
		this.employeeRepository = employeeRepository;
		this.projectHistoryRepository = projectHistoryRepository;
	}

//	@Override
//	public Project getProjectbyId(Integer projectId) {
//		Optional<Project> optional = projectRepository.findById(projectId);
//		if (optional.isPresent()) {
//			return optional.get();
//		} else {
//			return null;
//		}
//	}

//	@Override
//	public Project saveProject(Project project) {
//		for (Employee employee : project.getEmployees()) {
//			employee.setActive(true);
//			employee.setAssignmentDate(new Date());
//			employeeRepository.save(employee);
//		}
//		return projectRepository.save(project);
//	}
//
//	@Override
//	public Project updateProject(Project project) {
//		return projectRepository.save(project);
//	}

	@Override
	public void delete(Integer projectId) {
		Project projectToDelete = getById(projectId);
		List<Employee> employees = new ArrayList<>(projectToDelete.getEmployees());
		if (!employees.isEmpty()) {
			for (Employee employee : employees) {
				employee.setActive(false);
				employeeRepository.save(employee);
				unassignEmployee(employee, projectToDelete);
			}
		}

		projectToDelete.setActive(false);
		projectRepository.save(projectToDelete);

	}

//	@Override
//	public SearchResult<Project> search(@ModelAttribute ProjectSearchCriteria criteria, Pageable pageable) {
//		if (name == null) {
//			name = "";
//		}
//		SearchResult<Project> projectSearchResult = new SearchResult<>();
//		List<Project> projects = projectRepository.searchProjects(name, code, pageable).getContent();
//		projectSearchResult.setItems(projects);
//		projectSearchResult.setSize(projectRepository.searchResultCount(name));
//		return projectSearchResult;
//	}

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

//	@Override
//	public Project getByEmployeeId(Integer employeeId) {
//		return projectRepository.findByEmployeeId(employeeId);
//	}

	
}
