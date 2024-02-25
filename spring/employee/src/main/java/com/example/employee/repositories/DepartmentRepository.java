package com.example.employee.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.employee.models.Department;

public interface DepartmentRepository extends CrudRepository<Department, Integer>, PagingAndSortingRepository<Department, Integer> {
	
	public Page<Department> findAllByName(Pageable pageable, String name);
}
