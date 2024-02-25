package com.example.employee.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.models.Employee;
import com.example.employee.services.impl.EmployeeServiceImpl;

@RestController
@RequestMapping("/api")
public class EmplyeeController {

	@Autowired
	private EmployeeServiceImpl employeeServiceImpl;

	@GetMapping("/employees")
	public ResponseEntity<List<Employee>> getAllEmployees(Pageable pageable) {
		Page<Employee> employees = employeeServiceImpl.getAllEmployees(pageable);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employees.getContent());
	}

	@GetMapping("/employees/get-one/{employeeId}")
	public ResponseEntity<Employee> getEmployeebyId(@PathVariable Integer employeeId) {
		Employee employee = employeeServiceImpl.getEmployeebyId(employeeId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employee);
	}

	@GetMapping("/employees/get-by-department/{departmentId}")
	public ResponseEntity<List<Employee>> getByDepartmentId(Pageable pageable,@PathVariable Integer departmentId) {
		Page<Employee> employees = employeeServiceImpl.getByDepartmentId(pageable, departmentId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employees.getContent());
	}

	@PostMapping("/employees/create")
	public ResponseEntity<Employee> saveEmployee(@RequestBody Employee employee) {
		Employee newEmployee = employeeServiceImpl.saveEmployee(employee);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(newEmployee);
	}

	@PutMapping("/employees/update")
	public ResponseEntity<Employee> updateEmployee(@RequestBody Employee employee) {
		Employee updatedEmployee = employeeServiceImpl.saveEmployee(employee);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(updatedEmployee);
	}

	@DeleteMapping("/employees/delete/{employeeId}")
	public ResponseEntity<Void> delete(@PathVariable Integer employeeId) {
		employeeServiceImpl.deleteEmployee(employeeId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(null);
	}

}
