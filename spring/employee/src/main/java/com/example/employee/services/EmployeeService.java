package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.Employee;
import com.example.employee.models.EmployeeSearchResult;
import com.example.employee.models.Skill;

public interface EmployeeService {
	
	public EmployeeSearchResult getAllEmployees(Pageable pageable);
	public List<Employee> getAllEmployees();
	public Employee getEmployeebyId(Integer employeeId); 
	public EmployeeSearchResult getEmployeeByDepartmentId(Pageable pageable, Integer departmentId);
	public Employee saveEmployee(Employee employee);
	public Employee updateEmployee(Employee employee);
	public void deleteEmployee(Integer employeeId);
	public List<Employee> filterByActive(Boolean active);
	public EmployeeSearchResult searcEmployees(String name, String surname, String email, Pageable pageable);
	public List<Employee> filterEmployeesByActiveAndSkills(List<Skill> skills, Integer departmentId);
	public Employee findByUserId(Integer userId); 
}
