package com.example.employee.controllers;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.criteria.ProjectHistorySearchCriteria;
import com.example.employee.models.ApiError;
import com.example.employee.models.ProjectHistory;
import com.example.employee.models.dtos.ProjectHistoryDTO;
import com.example.employee.services.ProjectHistoryService;

@RestController
@RequestMapping("/api/project-history")
public class ProjectHistoryController {

	private ProjectHistoryService projectHistoryService;
	
	
	public ProjectHistoryController(ProjectHistoryService projectHistoryService) {
		this.projectHistoryService = projectHistoryService;
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<ProjectHistoryDTO>> searchProjectHistory(@ModelAttribute ProjectHistorySearchCriteria criteria) {
		return ResponseEntity.ok().headers(new HttpHeaders()).body(projectHistoryService.search(criteria));
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
		if (ex.getMessage().equals("No property 'string' found for type 'ProjectHistory'")) {
			message = "Parameter value is unsuported. Please use desc or asc";
		}
		return ApiError.builder().message(message).status(400).build();
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoSuchElementException.class)
	public ApiError handleNotFoundExceptions(NoSuchElementException ex) {
		String message = "There is no project history with submitted id";
		return ApiError.builder().message(message).status(404).build();
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ApiError handleMessageException(HttpMessageNotReadableException ex) {
		String message = ex.getMessage();
		return ApiError.builder().message(message).status(400).build();
	}
}
