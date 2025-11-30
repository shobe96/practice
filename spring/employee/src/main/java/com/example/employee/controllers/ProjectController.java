package com.example.employee.controllers;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
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

import com.example.employee.criteria.ProjectSearchCriteria;
import com.example.employee.models.Project;
import com.example.employee.models.RestError;
import com.example.employee.models.SearchResult;
import com.example.employee.services.ProjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
	private ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@GetMapping()
	public ResponseEntity<List<Project>> getAllProjects() {
		return ResponseEntity.ok().body(projectService.getAll());
	}

	@GetMapping("/get-one/{projectId}")
	public ResponseEntity<Object> getProjectById(@PathVariable Integer projectId) {
		Project project = projectService.getById(projectId);
		if (project == null) {
			throw new NoSuchElementException();
		} else {
			return ResponseEntity.ok().body(project);
		}
	}

	@PostMapping("/create")
	public ResponseEntity<Project> saveProject(@Valid @RequestBody Project project) {
		Project newProject = projectService.save(project);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newProject.getId())
				.toUri();
		return ResponseEntity.created(location).body(newProject);
	}

	@PutMapping("/update")
	public ResponseEntity<Project> updateProject(@Valid @RequestBody Project project) {
		Project updatedProject = projectService.save(project);
		return ResponseEntity.ok().body(updatedProject);
	}

	@DeleteMapping("/delete/{projectId}")
	public ResponseEntity<Void> deleteProject(@PathVariable Integer projectId) {
		projectService.delete(projectId);
		return ResponseEntity.ok().body(null);
	}

	@GetMapping("/search")
	public ResponseEntity<SearchResult<Project>> searchProjects(@ModelAttribute ProjectSearchCriteria criteria,
			Pageable pageable) {
		return ResponseEntity.ok().body(projectService.search(criteria, pageable));
	}

	@PostMapping("/unassign-employee/{employeeId}")
	public ResponseEntity<Void> unassignEmployee(@PathVariable Integer employeeId, @RequestBody Project project) {
		projectService.unassignEmployee(employeeId, project);
		return ResponseEntity.ok().body(null);
	}

	@GetMapping("/history/{employeeId}")
	public ResponseEntity<List<Project>> getProjectsByEmployee(@PathVariable Integer employeeId) {
		ProjectSearchCriteria criteria = new ProjectSearchCriteria();
		criteria.setPhEmployeeId(employeeId);
		List<Project> projects = projectService.search(criteria);
		if (!projects.isEmpty()) {
			return ResponseEntity.ok().body(projects);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/get-project/{employeeId}")
	public ResponseEntity<Project> getProjectByEmployee(@PathVariable Integer employeeId) {
		ProjectSearchCriteria criteria = new ProjectSearchCriteria();
		criteria.setEmployeeId(employeeId);
		List<Project> projects = projectService.search(criteria);
		if (projects != null) {
			if (projects.size() > 0) {
				return ResponseEntity.ok().body(projects.get(0));
			} else {
				throw new NoSuchElementException();
			}

		} else {
			throw new NoSuchElementException();
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
		if (ex.getMessage().equals("No property 'string' found for type 'Project'")) {
			message = "Parameter value is unsuported. Please use desc or asc";
			field = "sort";
		}
		errors.put(field, message);
		return errors;
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<Object> handleNotFoundExceptions(NoSuchElementException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = "There is no project with submitted id";
		String field = "project";
		errors.put(field, message);
		RestError re = new RestError(HttpStatus.NOT_FOUND.value(), "Not Found", false, "HttpErrorResponse",
				"There is not resource with given id.");
		return new ResponseEntity<>(re, HttpStatus.NOT_FOUND);
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public Map<String, String> handleMessageException(HttpMessageNotReadableException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = ex.getMessage();
		String field = "project";
		errors.put(field, message);
		return errors;
	}
}
