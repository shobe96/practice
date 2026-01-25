package com.example.employee.services;

import java.util.List;

import com.example.employee.models.ProjectHistory;
import com.example.employee.models.dtos.ProjectHistoryDTO;

public interface ProjectHistoryService extends BaseService<ProjectHistory, ProjectHistoryDTO,Integer>{

	public List<ProjectHistory> getProjectsHistoryOfEmployee(Integer employeeId);
}
