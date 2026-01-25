package com.example.employee.services.impl;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Service;

import com.example.employee.mappers.BaseMapper;
import com.example.employee.mappers.ProjectHistoryMapper;
import com.example.employee.models.ProjectHistory;
import com.example.employee.models.dtos.ProjectHistoryDTO;
import com.example.employee.repositories.ProjectHistoryRepository;
import com.example.employee.services.ProjectHistoryService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProjectHistoryServiceImpl extends BaseServiceImpl<ProjectHistory, ProjectHistoryDTO, Integer> implements ProjectHistoryService {

	private ProjectHistoryRepository projectHistoryRepository;
	private ProjectHistoryMapper projectHistoryMapper;

	public ProjectHistoryServiceImpl(ProjectHistoryRepository projectHistoryRepository, ProjectHistoryMapper projectHistoryMapper) {
		super();
		this.projectHistoryRepository = projectHistoryRepository;
		this.projectHistoryMapper = projectHistoryMapper;
	}

	@Override
	public List<ProjectHistory> getProjectsHistoryOfEmployee(Integer employeeId) {
		return projectHistoryRepository.getProjectsHistoryOfEmployee(employeeId);
	}

	@Override
	protected JpaRepository<ProjectHistory, Integer> getRepository() {
		return projectHistoryRepository;
	}

	@Override
	protected JpaSpecificationExecutor<ProjectHistory> getSpecificationExecutor() {
		return projectHistoryRepository;
	}

	@Override
	protected BaseMapper<ProjectHistory, ProjectHistoryDTO> getMapper() {
		return projectHistoryMapper;
	}

}
