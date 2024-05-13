package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Project;
import com.example.employee.models.ProjectSearchResult;
import com.example.employee.repositories.ProjectRepository;
import com.example.employee.services.ProjectService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {
	
	private ProjectRepository projectRepository;

	@Autowired
	public ProjectServiceImpl(ProjectRepository projectRepository) {
		this.projectRepository = projectRepository;
	}

	@Override
	public ProjectSearchResult getAllProjects(Pageable pageable) {
		ProjectSearchResult projectSearchResult = new ProjectSearchResult();
		projectSearchResult.setSize(projectRepository.count());
		projectSearchResult.setProjects(projectRepository.findAll(pageable).getContent());
		return projectSearchResult;
	}

	@Override
	public List<Project> getAllProjects() {
		List<Project> projects = new ArrayList<>();
		projectRepository.findAll().forEach(projects::add);
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
		return projectRepository.save(project);
	}

	@Override
	public Project updateProject(Project project) {
		return projectRepository.save(project);
	}

	@Override
	public void deleteProject(Integer projectId) {
		Project project = getProjectbyId(projectId);
		projectRepository.delete(project);

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

}
