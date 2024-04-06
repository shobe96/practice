package com.example.employee.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Department;

@Repository
public interface DepartmentRepository extends CrudRepository<Department, Integer>, PagingAndSortingRepository<Department, Integer> {
	
	public Department findByName(String name);
	
	@Query("SELECT d FROM Department d WHERE d.name LIKE CONCAT('%', :name, '%')")
	public Page<Department> searchDepartments(String name, Pageable pageable);
	
	@Query("SELECT COUNT(d) FROM Department d WHERE d.name LIKE CONCAT('%', :name, '%')")
	public Long searchResultCount(String name);
}
