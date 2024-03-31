package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;
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

	@Override
	public List<Employee> filterByActive(Boolean active) {
		List<Employee> employees = new ArrayList<Employee>();
		employeeRepository.findAll().forEach(employees::add);
		employees.removeIf(employee -> employee.getActive() != active);
		return employees;
	}

	@Override
	public Long getEmployeeCount() {
		// TODO Auto-generated method stub
		return employeeRepository.count();
	}
	
//	@Override
//	public Employee getEmployeebyId2(Integer employeeId) throws Exception {
//		Optional<Employee> employeeOptional = employeeRepository.findById(employeeId);
//		if (employeeOptional.isPresent()) {
//			return employeeOptional.get();
//		} else {
//			throw new Exception("Employee not found for id: " + employeeId);
//		}
//	}
}
