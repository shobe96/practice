package com.example.employee.services;

import java.util.List;

import com.example.employee.models.ProjectHistory;

public interface ProjectHistoryService {

	public List<ProjectHistory> getProjectsHistoryOfEmployee(Integer employeeId);
}
