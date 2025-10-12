package com.example.employee.controllers;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.example.employee.criteria.DepartmentCriteria;
import com.example.employee.models.Department;
import com.example.employee.models.SearchResult;
import com.example.employee.services.DepartmentService;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

	private DepartmentService departmentService;

	public DepartmentController(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	@GetMapping()
	public ResponseEntity<List<Department>> getAllDepartments() {
		return ResponseEntity.ok().body(departmentService.getAll());
	}

	@GetMapping("/get-one/{departmentId}")
	public ResponseEntity<Department> getDepartmentById(@PathVariable Integer departmentId) {
		Department department = departmentService.getById(departmentId);
		if (department == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok().body(department);
		}

	}

	@GetMapping("/search")
	public ResponseEntity<SearchResult<Department>> search(@ModelAttribute DepartmentCriteria criteria,
			Pageable pageable) {
		return ResponseEntity.ok().body(departmentService.search(criteria, pageable));
	}

	@PostMapping("/create")
	public ResponseEntity<Department> saveDepartment(@RequestBody Department department) {
		Department newDepartment = departmentService.save(department);
		return ResponseEntity.ok().body(newDepartment);
	}

	@PutMapping("/update")
	public ResponseEntity<Department> updateDepartment(@RequestBody Department department) {
		Department newDepartment = departmentService.save(department);
		return ResponseEntity.ok().body(newDepartment);
	}

	@DeleteMapping("/delete/{departmentId}")
	public ResponseEntity<Void> deleteDepartment(@PathVariable Integer departmentId) {
		departmentService.delete(departmentId);
		return ResponseEntity.ok().body(null);
	}

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
		if (ex.getMessage().equals("No property 'string' found for type 'Department'")) {
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
		String message = "There is no department with submitted id";
		String field = "department";
		errors.put(field, message);
		return errors;
	}

}
