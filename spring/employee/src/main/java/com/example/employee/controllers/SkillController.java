package com.example.employee.controllers;

import java.net.URI;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mapping.PropertyReferenceException;
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

import com.example.employee.criteria.SkillSearchCriteria;
import com.example.employee.models.ApiError;
import com.example.employee.models.SearchResult;
import com.example.employee.models.Skill;
import com.example.employee.services.SkillService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

	private SkillService skillService;

	public SkillController(SkillService skillService) {
		this.skillService = skillService;
	}

	@GetMapping()
	public ResponseEntity<List<Skill>> getAllSkills() {
		List<Skill> skills = skillService.getAll();

		return ResponseEntity.ok().body(skills);
	}

	@GetMapping("/get-one/{skillId}")
	public ResponseEntity<Object> getSkillById(@PathVariable Integer skillId) {
		Skill skill = skillService.getById(skillId);
		if (skill == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok().body(skill);
		}
	}

	@PostMapping("/create")
	public ResponseEntity<Skill> saveSkill(@Valid @RequestBody Skill skill) {
		Skill newSkill = skillService.save(skill);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newSkill.getId())
				.toUri();
		return ResponseEntity.created(location).body(newSkill);
	}

	@PutMapping("/update")
	public ResponseEntity<Skill> updateSkill(@Valid @RequestBody Skill skill) {
		Skill updatedSkill = skillService.save(skill);
		return ResponseEntity.ok().body(updatedSkill);
	}

	@DeleteMapping("/delete/{skillId}")
	public ResponseEntity<Void> deleteSkill(@PathVariable Integer skillId) {
		skillService.delete(skillId);
		return ResponseEntity.ok().body(null);
	}

	@GetMapping("/search")
	public ResponseEntity<SearchResult<Skill>> searchSkills(@ModelAttribute SkillSearchCriteria criteria,
			Pageable pageable) {
		return ResponseEntity.ok().body(skillService.search(criteria, pageable));
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
		if (ex.getMessage().equals("No property 'string' found for type 'Skill'")) {
			message = "Parameter value is unsuported. Please use desc or asc";
		}
		return ApiError.builder().message(message).status(400).build();
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoSuchElementException.class)
	public ApiError handleNotFoundExceptions(NoSuchElementException ex) {
		String message = "There is no project with submitted id";
		return ApiError.builder().message(message).status(404).build();
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ApiError handleMessageException(HttpMessageNotReadableException ex) {
		String message = ex.getMessage();
		return ApiError.builder().message(message).status(400).build();
	}

}
