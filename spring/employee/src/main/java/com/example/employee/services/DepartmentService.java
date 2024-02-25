package com.example.employee.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.employee.models.Department;

public interface DepartmentService {
	public Page<Department> getAllDepartments(Pageable pageable);
	public Department getDepartmentById(Integer departmentId);
	public Page<Department> getByDepartmentName(Pageable pageable, String departmentName);
	public Department saveDepartment(Department department);
	public Department updateDepartment(Department department);
	public void deleteDepartment(Integer departmentId);
}
