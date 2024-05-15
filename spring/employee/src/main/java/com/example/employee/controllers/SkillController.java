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

import com.example.employee.models.Skill;
import com.example.employee.models.SkillSearchResult;
import com.example.employee.services.SkillService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/skills")
public class SkillController {

	private SkillService skillService;

	@Autowired
	public SkillController(SkillService skillService) {
		this.skillService = skillService;
	}

	@GetMapping()
	public ResponseEntity<SkillSearchResult> getAllSkills(Pageable pageable, @RequestParam() Boolean all) {
		SkillSearchResult skills = new SkillSearchResult();
		if (all.equals(true)) {
			skills = skillService.getAllSkills();
		} else {
			skills = skillService.getAllSkills(pageable);
		}

		return ResponseEntity.ok().body(skills);
	}

	@GetMapping("/get-one/{skillId}")
	public ResponseEntity<Object> getSkillById(@PathVariable Integer skillId) {
		Skill skill = skillService.getSkillbyId(skillId);
		if (skill == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok().body(skill);
		}
	}

	@PostMapping("/create")
	public ResponseEntity<Skill> saveSkill(@Valid @RequestBody Skill skill) {
		Skill newSkill = skillService.saveSkill(skill);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newSkill.getId())
				.toUri();
		return ResponseEntity.created(location).body(newSkill);
	}

	@PutMapping("/update")
	public ResponseEntity<Skill> updateSkill(@Valid @RequestBody Skill skill) {
		Skill updatedSkill = skillService.saveSkill(skill);
		return ResponseEntity.ok().body(updatedSkill);
	}

	@DeleteMapping("/delete/{skillId}")
	public ResponseEntity<Void> deleteSkill(@PathVariable Integer skillId) {
		skillService.deleteSkill(skillId);
		return ResponseEntity.ok().body(null);
	}

	@GetMapping("/search")
	public ResponseEntity<SkillSearchResult> searchEMployees(@RequestParam(required = false) String name,
			Pageable pageable) {
		return ResponseEntity.ok().body(skillService.searcSkills(name, pageable));
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
		if (ex.getMessage().equals("No property 'string' found for type 'Skill'")) {
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
		String field = "skill";
		errors.put(field, message);
		return errors;
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public Map<String, String> handleMessageException(HttpMessageNotReadableException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = ex.getMessage();
		String field = "skill";
		errors.put(field, message);
		return errors;
	}

}
