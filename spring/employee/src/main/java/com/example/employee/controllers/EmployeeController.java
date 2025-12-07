package com.example.employee.controllers;

import java.net.URI;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.employee.criteria.EmployeeSearchCriteria;
import com.example.employee.models.ApiError;
import com.example.employee.models.Employee;
import com.example.employee.models.SearchResult;
import com.example.employee.models.Skill;
import com.example.employee.services.EmployeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

	private EmployeeService employeeService;

	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	@GetMapping()
	public ResponseEntity<List<Employee>> getAllEmployees() {
		return ResponseEntity.ok().body(employeeService.getAll());
	}

	@GetMapping("/get-one/{employeeId}")
	public ResponseEntity<Object> getEmployeeById(@PathVariable Integer employeeId) {
		Employee employee = employeeService.getById(employeeId);
		if (employee == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok().body(employee);
		}
	}

	@GetMapping("/get-by-department/{departmentId}")
	public ResponseEntity<SearchResult<Employee>> getEmployeeByDepartmentId(Pageable pageable,
			@PathVariable Integer departmentId) {
		EmployeeSearchCriteria searchCriteria = new EmployeeSearchCriteria();
		searchCriteria.setDepartmentId(departmentId);
		SearchResult<Employee> employeeSearchResult = employeeService.search(searchCriteria, pageable);
		return ResponseEntity.ok().body(employeeSearchResult);
	}

	@PostMapping("/create")
	public ResponseEntity<Employee> saveEmployee(@Valid @RequestBody Employee employee) {
		Employee newEmployee = employeeService.save(employee);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
				.buildAndExpand(newEmployee.getId()).toUri();
		return ResponseEntity.created(location).body(newEmployee);
	}

	@PutMapping("/update")
	public ResponseEntity<Employee> updateEmployee(@Valid @RequestBody Employee employee) {
		Employee updatedEmployee = employeeService.save(employee);
		return ResponseEntity.ok().body(updatedEmployee);
	}

	@DeleteMapping("/delete/{employeeId}")
	public ResponseEntity<Void> deleteEmployee(@PathVariable Integer employeeId) {
		employeeService.delete(employeeId);
		return ResponseEntity.ok().body(null);
	}

	@GetMapping("/search")
	public ResponseEntity<SearchResult<Employee>> searchEmployees(@ModelAttribute EmployeeSearchCriteria criteria,
			Pageable pageable) {
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employeeService.search(criteria, pageable));
	}

	@PostMapping("/filter-by-active-and-skills/{departmentId}")
	public ResponseEntity<List<Employee>> filterEmployeesByActiveAndSkills(@PathVariable Integer departmentId,
			@RequestBody List<Skill> skills) {
		EmployeeSearchCriteria searchCriteria = new EmployeeSearchCriteria();
		searchCriteria.setSkills(skills);
		searchCriteria.setActive(true);
		return ResponseEntity.ok().headers(new HttpHeaders()).body(employeeService.search(searchCriteria));
	}

	@GetMapping("/find-by-user/{userId}")
	public ResponseEntity<Object> findByUser(@PathVariable Integer userId) {
		EmployeeSearchCriteria searchCriteria = new EmployeeSearchCriteria();
		searchCriteria.setUserId(userId);
		List<Employee> employees = employeeService.search(searchCriteria);
		if (employees == null) {
			return ResponseEntity.notFound().build();
		} else {
			if (employees.size() > 0) {

				return ResponseEntity.ok().body(employees.get(0));
			} else {
				return ResponseEntity.notFound().build();
			}
		}
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ApiError handleValidationExceptions(MethodArgumentNotValidException ex) {
		final StringBuilder messageBuilder = new StringBuilder();
		ex.getBindingResult().getAllErrors().forEach(error -> {
			messageBuilder.append(error.getDefaultMessage());
			messageBuilder.append("\n");
		});
		return ApiError.builder().message(messageBuilder.toString()).status(400).build();
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(PropertyReferenceException.class)
	public ApiError handleSortExceptions(PropertyReferenceException ex) {
		String message = "";
		if (ex.getMessage().equals("No property 'string' found for type 'Employee'")) {
			message = "Parameter value is unsuported. Please use desc or asc";
		}
		return ApiError.builder().message(message).status(400).build();
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoSuchElementException.class)
	public ApiError handleNotFoundExceptions(NoSuchElementException ex) {
		String message = "There is no employee with submitted id";
		return ApiError.builder().message(message).status(404).build();
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ApiError handleMessageException(HttpMessageNotReadableException ex) {
		String message = ex.getMessage();
		return ApiError.builder().message(message).status(400).build();
	}
}
