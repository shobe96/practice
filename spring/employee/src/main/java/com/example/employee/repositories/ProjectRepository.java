package com.example.employee.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Project;

@Repository
public interface ProjectRepository
extends JpaRepository<Project, Integer>, JpaSpecificationExecutor<Project> {
	
//	@Query("SELECT p FROM Project p WHERE (p.name LIKE CONCAT('%', :name, '%') OR p.name IS NULL) AND (p.code LIKE CONCAT('%', :code, '%') OR p.code IS NULL) AND p.active = true")
//	Page<Project> searchProjects(String name, String code, Pageable pageable);

//	@Query("SELECT COUNT(p) FROM Project p WHERE p.name LIKE CONCAT('%', :name, '%') AND p.active = true")
//	Long searchResultCount(String name);
	
	Page<Project> findAllByActive(Boolean active, Pageable pageable);
	
	List<Project> findAllByActive(Boolean active);
	
	@Query("SELECT COUNT(p) FROM Project p WHERE p.active = true")
	Long countAllActiveProjects();
	
//	@Query("SELECT p FROM Project p LEFT JOIN ProjectHistory ph ON p.id = ph.project.id WHERE ph.employee.id =:employeeId")
//	List<Project> findAllByEmployee(Integer employeeId);
//	
//	@Query(nativeQuery = true, value = "SELECT p.* FROM employee.project as p LEFT JOIN employee.employee_project as ep ON ep.project_id = p.project_id WHERE ep.employee_id = ?1")
//	Project findByEmployeeId(Integer employeeId);
}
