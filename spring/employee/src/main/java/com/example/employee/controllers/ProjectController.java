package com.example.employee.controllers;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mapping.PropertyReferenceException;
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

import com.example.employee.models.Project;
import com.example.employee.models.ProjectSearchResult;
import com.example.employee.services.ProjectService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/projects")
public class ProjectController {
	private ProjectService projectService;

	@Autowired
	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@GetMapping()
	public ResponseEntity<ProjectSearchResult> getAllProjects(Pageable pageable, @RequestParam() Boolean all) {
		ProjectSearchResult projects = new ProjectSearchResult();
		if (all.equals(true)) {
			projects.setProjects(projectService.getAllProjects());
			;
		} else {
			projects = projectService.getAllProjects(pageable);
		}

		return ResponseEntity.ok().body(projects);
	}

	@GetMapping("/get-one/{projectId}")
	public ResponseEntity<Object> getProjectById(@PathVariable Integer projectId) {
		Project project = projectService.getProjectbyId(projectId);
		if (project == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok().body(project);
		}
	}

	@PostMapping("/create")
	public ResponseEntity<Project> saveProject(@Valid @RequestBody Project project) {
		Project newProject = projectService.saveProject(project);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newProject.getId())
				.toUri();
		return ResponseEntity.created(location).body(newProject);
	}

	@PutMapping("/update")
	public ResponseEntity<Project> updateProject(@Valid @RequestBody Project project) {
		Project updatedProject = projectService.saveProject(project);
		return ResponseEntity.ok().body(updatedProject);
	}

	@DeleteMapping("/delete/{projectId}")
	public ResponseEntity<Void> deleteProject(@PathVariable Integer projectId) {
		projectService.deleteProject(projectId);
		return ResponseEntity.ok().body(null);
	}

	@GetMapping("/search")
	public ResponseEntity<ProjectSearchResult> searchEMployees(@RequestParam(required = false) String name,
			Pageable pageable) {
		return ResponseEntity.ok().body(projectService.searcProjects(name, pageable));
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
	public Map<String, String> handleNotFoundExceptions(NoSuchElementException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = "There is no employee with submitted id";
		String field = "project";
		errors.put(field, message);
		return errors;
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
