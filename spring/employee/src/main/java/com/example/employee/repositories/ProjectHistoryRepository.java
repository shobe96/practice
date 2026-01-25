package com.example.employee.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import com.example.employee.models.ProjectHistory;

public interface ProjectHistoryRepository
extends JpaRepository<ProjectHistory, Integer>, JpaSpecificationExecutor<ProjectHistory> {

	@Query("DELETE FROM ProjectHistory ph WHERE ph.employee.id =:employeeId")
	@Modifying
	public void deleteProjectHistoryByEmployee(Integer employeeId);
	
	@Query("SELECT ph FROM ProjectHistory ph WHERE ph.employee.id =:employeeId")
	public List<ProjectHistory> getProjectsHistoryOfEmployee(Integer employeeId);
}
