package com.example.employee.controllers;

import java.net.URI;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;

import com.example.employee.models.Employee;
import com.example.employee.services.EmployeeService;
import com.example.employee.services.impl.EmployeeServiceImpl;

import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/api")
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	@GetMapping("/employees")
	public ResponseEntity<List<Employee>> getAllEmployees(Pageable pageable) {
		Page<Employee> employees = employeeService.getAllEmployees(pageable);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employees.getContent());
	}

	@GetMapping("/employees/get-one/{employeeId}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable Integer employeeId) {
		Employee employee = employeeService.getEmployeebyId(employeeId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employee);
	}

	@GetMapping("/employees/get-by-department/{departmentId}")
	public ResponseEntity<List<Employee>> getEmployeeByDepartmentId(Pageable pageable,
			@PathVariable Integer departmentId) {
		Page<Employee> employees = employeeService.getEmployeeByDepartmentId(pageable, departmentId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employees.getContent());
	}

	@PostMapping("/employees/create")
	public ResponseEntity<Employee> saveEmployee(@Valid @RequestBody Employee employee) {
		Employee newEmployee = employeeService.saveEmployee(employee);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
				.buildAndExpand(newEmployee.getId()).toUri();
		return ResponseEntity.created(location).headers(new HttpHeaders()).body(newEmployee);
	}

	@PutMapping("/employees/update")
	public ResponseEntity<Employee> updateEmployee(@RequestBody Employee employee) {
		Employee updatedEmployee = employeeService.saveEmployee(employee);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(updatedEmployee);
	}

	@DeleteMapping("/employees/delete/{employeeId}")
	public ResponseEntity<Void> deleteEmployee(@PathVariable Integer employeeId) {
		employeeService.deleteEmployee(employeeId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(null);
	}

//	@GetMapping("/employees/get-by-active")
//	public ResponseEntity<List<Employee>> getEmployeesByActive(@PathParam("active") Boolean active) {
//		List<Employee> employees = employeeService.filterByActive(active);
//
//		return ResponseEntity.ok().headers(new HttpHeaders()).body(employees);
//	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(SQLException.class)
	public Map<String, String> handleValidationExceptions(SQLException ex) {
		Map<String, String> errors = new HashMap<>();
		for (Throwable t : ex) {
			String field = t.getMessage();
			field = field.substring(field.indexOf("'") + 1);
			field = field.substring(0, field.indexOf("'"));
			String message = "";
			if (t.getMessage().contains("long")) {
				message = "Field execeds maximum number of characters";
			}

			if (t.getMessage().contains("null")) {
				message = "Field is mandatory";
			}
			errors.put(field, message);
		}
		return errors;
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(PropertyReferenceException.class)
	public Map<String, String> handleSortExceptions(PropertyReferenceException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = "";
		String field = "";
		if (ex.getMessage().equals("No property 'string' found for type 'Employee'")) {
			message = "Parameter value is unsuported. Please use desc or asc";
			field = "sort";
		}
		errors.put(field, message);
		return errors;
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoSuchElementException.class)
	public Map<String, String> handleNotFoundExceptions(NoSuchElementException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = "There is no employee with submitted id";
		String field = "employee";
		errors.put(field, message);
		return errors;
	}

	
}
