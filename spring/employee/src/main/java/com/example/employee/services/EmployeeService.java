package com.example.employee.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.employee.models.Employee;

public interface EmployeeService {
	
	public Page<Employee> getAllEmployees(Pageable pageable);
	public Employee getEmployeebyId(Integer employeeId); 
	public Page<Employee> getByDepartmentId(Pageable pageable, Integer departmentId);
	public Employee saveEmployee(Employee employee);
	public Employee updateEmployee(Employee employee);
	public void delete(Integer employeeId);
}
