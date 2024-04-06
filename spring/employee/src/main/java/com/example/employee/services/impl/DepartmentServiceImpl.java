package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Department;
import com.example.employee.models.DepartmentSearchResult;
import com.example.employee.repositories.DepartmentRepository;
import com.example.employee.services.DepartmentService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {
	
	@Autowired
	private DepartmentRepository departmentRepository;

	@Override
	public DepartmentSearchResult getAllDepartments(Pageable pageable) {
		DepartmentSearchResult departmentSearchResult = new DepartmentSearchResult();
		departmentSearchResult.setDepartments(departmentRepository.findAll(pageable).getContent());
		departmentSearchResult.setSize(departmentRepository.count());
		return departmentSearchResult;
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

	@Override
	public List<Department> getAllDepartments() {
		List<Department> departments = new ArrayList<Department>();
		departmentRepository.findAll().forEach(departments::add);;
		return departments;
	}

	@Override
	public DepartmentSearchResult searchDepartments(String name, Pageable pageable) {
		DepartmentSearchResult departmentSearchResult = new DepartmentSearchResult();
		departmentSearchResult.setDepartments(departmentRepository.searchDepartments(name, pageable).getContent());
		departmentSearchResult.setSize(departmentRepository.searchResultCount(name));
		return departmentSearchResult;
	}
}
