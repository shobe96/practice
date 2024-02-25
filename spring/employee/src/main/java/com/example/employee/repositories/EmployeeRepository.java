package com.example.employee.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Employee;

@Repository
public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Integer>, CrudRepository<Employee, Integer> {
	
	public Page<Employee> findAllByDepartmentId(Pageable pageable, Integer departmentId);
}
