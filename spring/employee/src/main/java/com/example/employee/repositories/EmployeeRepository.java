package com.example.employee.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Employee;

@Repository
public interface EmployeeRepository
		extends PagingAndSortingRepository<Employee, Integer>, CrudRepository<Employee, Integer> {

	public Page<Employee> findAllByDepartmentId(Pageable pageable, Integer departmentId);

	@Query("SELECT e FROM Employee e WHERE (e.name LIKE CONCAT('%', :name, '%') OR e.name IS NULL) AND (e.surname LIKE CONCAT('%', :surname, '%') OR e.surname IS NULL) AND (e.email LIKE CONCAT('%', :email, '%') OR e.email IS NULL)")
	public Page<Employee> searchEmployees(String name, String surname, String email, Pageable pageable);
	
	@Query("SELECT COUNT(e) FROM Employee e WHERE e.name LIKE CONCAT('%', :name, '%') AND e.surname LIKE CONCAT('%', :surname, '%') AND e.email LIKE CONCAT('%', :email, '%')")
	public Long searchResultCount(String name, String surname, String email);
}
