package com.example.employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer>, JpaSpecificationExecutor<Department> {

//	public Department findByName(String name);
//
//	@Query("SELECT d FROM Department d WHERE d.name LIKE CONCAT('%', :name, '%')")
//	public Page<Department> searchDepartments(String name, Pageable pageable);
//
//	@Query("SELECT COUNT(d) FROM Department d WHERE d.name LIKE CONCAT('%', :name, '%')")
//	public Long searchResultCount(String name);
}
