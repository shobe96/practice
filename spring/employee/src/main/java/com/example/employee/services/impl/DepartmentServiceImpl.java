package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Department;
import com.example.employee.models.DepartmentSearchResult;
import com.example.employee.models.Employee;
import com.example.employee.repositories.DepartmentRepository;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.services.DepartmentService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

	private DepartmentRepository departmentRepository;
	private EmployeeRepository employeeRepository;

	@Autowired
	public DepartmentServiceImpl(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
		this.departmentRepository = departmentRepository;
		this.employeeRepository = employeeRepository;
	}

	@Override
	public DepartmentSearchResult getAllDepartments(Pageable pageable) {
		DepartmentSearchResult departmentSearchResult = new DepartmentSearchResult();
		List<Department> departments = departmentRepository.findAll(pageable).getContent();
		if (departments.size() == 0) {
			Pageable newPage = PageRequest.of((pageable.getPageNumber() - 1), pageable.getPageSize());
			departments = departmentRepository.findAll(newPage).getContent();
		}
		departmentSearchResult.setDepartments(departments);
		departmentSearchResult.setSize(departmentRepository.count());
		return departmentSearchResult;
	}

	@Override
	public Department getDepartmentById(Integer departmentId) {
		Optional<Department> optional = departmentRepository.findById(departmentId);
		if (optional.isPresent()) {			
			return optional.get();
		} else {
			return null;
		}
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
		employeeRepository.unassignEmployeesFromDepartment(departmentId);
		departmentRepository.delete(department);
	}

	@Override
	public List<Department> getAllDepartments() {
		List<Department> departments = new ArrayList<>();
		departmentRepository.findAll().forEach(departments::add);
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
