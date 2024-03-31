package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.employee.models.Employee;

public interface EmployeeService {
	
	public Page<Employee> getAllEmployees(Pageable pageable);
	public Employee getEmployeebyId(Integer employeeId); 
	public Page<Employee> getEmployeeByDepartmentId(Pageable pageable, Integer departmentId);
	public Employee saveEmployee(Employee employee);
	public Employee updateEmployee(Employee employee);
	public void deleteEmployee(Integer employeeId);
	public List<Employee> filterByActive(Boolean active);
//	public Employee getEmployeebyId2(Integer employeeId) throws Exception;
	public Long getEmployeeCount();
}
