package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Employee;
import com.example.employee.models.EmployeeSearchResult;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.services.EmployeeService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

	EmployeeRepository employeeRepository;

	@Autowired
	public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}

	@Override
	public EmployeeSearchResult getAllEmployees(Pageable pageable) {
		EmployeeSearchResult employeeSearchResult = new EmployeeSearchResult();
		employeeSearchResult.setSize(employeeRepository.count());
		employeeSearchResult.setEmployees(employeeRepository.findAll(pageable).getContent());
		return employeeSearchResult;
	}

	@Override
	public Employee getEmployeebyId(Integer employeeId) {
		Optional<Employee> optional = employeeRepository.findById(employeeId);
		if (optional.isPresent()) {
			return optional.get();
		} else {
			return null;
		}
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
		List<Employee> employees = new ArrayList<>();
		employeeRepository.findAll().forEach(employees::add);
		employees.removeIf(employee -> employee.getActive().equals(active));
		return employees;
	}

	@Override
	public EmployeeSearchResult searcEmployees(String name, String surname, String email, Pageable pageable) {
		if (name == null) {
			name = "";
		}
		if (surname == null) {
			surname = "";
		}
		if (email == null) {
			email = "";
		}
		EmployeeSearchResult employeeSearchResult = new EmployeeSearchResult();
		List<Employee> employees = employeeRepository.searchEmployees(name, surname, email, pageable).getContent();
		employeeSearchResult.setEmployees(employees);
		employeeSearchResult.setSize(employeeRepository.searchResultCount(name, surname, email));
		return employeeSearchResult;
	}

	@Override
	public List<Employee> getAllEmployees() {
		List<Employee> employees = new ArrayList<>();
		employees = employeeRepository.findEmployeesWithoutUser();
		return employees;
	}
}
