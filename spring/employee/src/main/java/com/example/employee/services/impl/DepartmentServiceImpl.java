package com.example.employee.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Department;
import com.example.employee.repositories.DepartmentRepository;
import com.example.employee.services.DepartmentService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {
	
	@Autowired
	private DepartmentRepository departmentRepository;

	@Override
	public Page<Department> getAllDepartments(Pageable pageable) {
		return departmentRepository.findAll(pageable);
	}
	
	@Override
	public Department getDepartmentById(Integer departmentId) {
		return departmentRepository.findById(departmentId).get();
	}

	@Override
	public Department getByDepartmentName(String departmentName) {
		return departmentRepository.findByName(departmentName);
	}

	@Override
	public Department saveDepartment(Department department) {
		return departmentRepository.save(department);
	}

	@Override
	public Department updateDepartment(Department department) {
		return departmentRepository.save(department);
	}

	@Override
	public void deleteDepartment(Integer departmentId) {
		Department department = getDepartmentById(departmentId);
		departmentRepository.delete(department);
	}
}
