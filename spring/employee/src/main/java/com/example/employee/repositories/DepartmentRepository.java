package com.example.employee.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.employee.models.Department;

public interface DepartmentRepository extends CrudRepository<Department, Integer>, PagingAndSortingRepository<Department, Integer> {
	
	public Department findByName(String name);
}
