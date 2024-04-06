package com.example.employee.controllers;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.example.employee.models.Employee;
import com.example.employee.models.EmployeeSearchResult;
import com.example.employee.services.EmployeeService;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/employees")
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	@GetMapping()
	public ResponseEntity<EmployeeSearchResult> getAllEmployees(Pageable pageable) {
		EmployeeSearchResult employees = employeeService.getAllEmployees(pageable);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employees);
	}

	@GetMapping("/get-one/{employeeId}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable Integer employeeId) {
		Employee employee = employeeService.getEmployeebyId(employeeId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employee);
	}

	@GetMapping("/get-by-department/{departmentId}")
	public ResponseEntity<List<Employee>> getEmployeeByDepartmentId(Pageable pageable,
			@PathVariable Integer departmentId) {
		Page<Employee> employees = employeeService.getEmployeeByDepartmentId(pageable, departmentId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employees.getContent());
	}

	@PostMapping("/create")
	public ResponseEntity<Employee> saveEmployee(@Valid @RequestBody Employee employee) {
		Employee newEmployee = employeeService.saveEmployee(employee);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
				.buildAndExpand(newEmployee.getId()).toUri();
		return ResponseEntity.created(location).headers(new HttpHeaders()).body(newEmployee);
	}

	@PutMapping("/update")
	public ResponseEntity<Employee> updateEmployee(@Valid @RequestBody Employee employee) {
		Employee updatedEmployee = employeeService.saveEmployee(employee);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(updatedEmployee);
	}

	@DeleteMapping("/delete/{employeeId}")
	public ResponseEntity<Void> deleteEmployee(@PathVariable Integer employeeId) {
		employeeService.deleteEmployee(employeeId);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(null);
	}
	
	@GetMapping("/search")
	public ResponseEntity<EmployeeSearchResult> searchEMployees(@RequestParam(required = false) String name, @RequestParam(required = false) String surname, @RequestParam(required = false) String email, Pageable pageable) {
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employeeService.searcEmployees(name, surname, email, pageable));
	}

//	@GetMapping("/employees/get-by-active")
//	public ResponseEntity<List<Employee>> getEmployeesByActive(@PathParam("active") Boolean active) {
//		List<Employee> employees = employeeService.filterByActive(active);
//
//		return ResponseEntity.ok().headers(new HttpHeaders()).body(employees);
//	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});
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
	
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public Map<String, String> name(HttpMessageNotReadableException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = ex.getMessage();
		String field = "employee";
		errors.put(field, message);
		return errors;
	}

}
