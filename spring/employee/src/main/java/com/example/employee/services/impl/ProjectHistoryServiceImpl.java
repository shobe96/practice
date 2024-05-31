package com.example.employee.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.employee.models.ProjectHistory;
import com.example.employee.repositories.ProjectHistoryRepository;
import com.example.employee.services.ProjectHistoryService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProjectHistoryServiceImpl implements ProjectHistoryService {

	private ProjectHistoryRepository projectHistoryRepository;

	@Autowired
	public ProjectHistoryServiceImpl(ProjectHistoryRepository projectHistoryRepository) {
		this.projectHistoryRepository = projectHistoryRepository;
	}

	@Override
	public List<ProjectHistory> getProjectsHistoryOfEmployee(Integer employeeId) {
		return projectHistoryRepository.getProjectsHistoryOfEmployee(employeeId);
	}

}
