package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.employee.models.Employee;
import com.example.employee.models.EmployeeSearchResult;

public interface EmployeeService {
	
	public EmployeeSearchResult getAllEmployees(Pageable pageable);
	public List<Employee> getAllEmployees();
	public Employee getEmployeebyId(Integer employeeId); 
	public Page<Employee> getEmployeeByDepartmentId(Pageable pageable, Integer departmentId);
	public Employee saveEmployee(Employee employee);
	public Employee updateEmployee(Employee employee);
	public void deleteEmployee(Integer employeeId);
	public List<Employee> filterByActive(Boolean active);
	public EmployeeSearchResult searcEmployees(String name, String surname, String email, Pageable pageable);
}
