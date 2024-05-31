package com.example.employee.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.employee.models.ProjectHistory;

public interface ProjectHistoryRepository
		extends CrudRepository<ProjectHistory, Integer>, PagingAndSortingRepository<ProjectHistory, Integer> {

	@Query("DELETE FROM ProjectHistory ph WHERE ph.employee.id =:employeeId")
	@Modifying
	public void deleteProjectHistoryByEmployee(Integer employeeId);
	
	@Query("SELECT ph FROM ProjectHistory ph WHERE ph.employee.id =:employeeId")
	public List<ProjectHistory> getProjectsHistoryOfEmployee(Integer employeeId);
}
