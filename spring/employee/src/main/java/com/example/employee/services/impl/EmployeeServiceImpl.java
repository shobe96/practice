package com.example.employee.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Employee;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.services.EmployeeService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

	@Autowired
	EmployeeRepository employeeRepository;

	@Override
	public Page<Employee> getAllEmployees(Pageable pageable) {
		return employeeRepository.findAll(pageable);
	}

	@Override
	public Employee getEmployeebyId(Integer employeeId) {
		return employeeRepository.findById(employeeId).get();
	}

	@Override
	public Page<Employee> getEmployeeByDepartmentId(Pageable pageable, Integer departmentId) {
		return employeeRepository.findAllByDepartmentId(pageable, departmentId);
	}

	@Override
	public Employee saveEmployee(Employee employee) {
		return employeeRepository.save(employee);
	}

	@Override
	public Employee updateEmployee(Employee employee) {
		return employeeRepository.save(employee);
	}

	@Override
	public void deleteEmployee(Integer employeeId) {
		Employee employee = getEmployeebyId(employeeId);
		employeeRepository.delete(employee);
	}
}
