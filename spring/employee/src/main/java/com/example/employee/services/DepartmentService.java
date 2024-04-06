package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.Department;
import com.example.employee.models.DepartmentSearchResult;

public interface DepartmentService {
	public DepartmentSearchResult getAllDepartments(Pageable pageable);
	public List<Department> getAllDepartments();
	public Department getDepartmentById(Integer departmentId);
	public Department getByDepartmentName(String departmentName);
	public Department saveDepartment(Department department);
	public Department updateDepartment(Department department);
	public void deleteDepartment(Integer departmentId);
	public DepartmentSearchResult searchDepartments(String name, Pageable pageable);
}
