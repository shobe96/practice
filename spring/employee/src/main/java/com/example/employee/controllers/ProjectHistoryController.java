package com.example.employee.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.models.ProjectHistory;
import com.example.employee.services.ProjectHistoryService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/project-history")
public class ProjectHistoryController {

	private ProjectHistoryService projectHistoryService;
	
	
	@Autowired
	public ProjectHistoryController(ProjectHistoryService projectHistoryService) {
		this.projectHistoryService = projectHistoryService;
	}

	@GetMapping("/{employeeId}")
	public ResponseEntity<List<ProjectHistory>> getProjectsHistoryOfEmployee(@PathVariable Integer employeeId) {
		List<ProjectHistory> projectHistories = projectHistoryService.getProjectsHistoryOfEmployee(employeeId);
		if (!projectHistories.isEmpty()) {
			return ResponseEntity.ok().body(projectHistories);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach(error -> {
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
		if (ex.getMessage().equals("No property 'string' found for type 'ProjectHistory'")) {
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
		String message = "There is no project history with submitted id";
		String field = "projectHistory";
		errors.put(field, message);
		return errors;
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public Map<String, String> handleMessageException(HttpMessageNotReadableException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = ex.getMessage();
		String field = "projectHistory";
		errors.put(field, message);
		return errors;
	}
}
