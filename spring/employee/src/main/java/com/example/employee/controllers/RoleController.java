package com.example.employee.controllers;

import java.util.List;
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

import com.example.employee.criteria.RoleSearchCriteria;
import com.example.employee.models.ApiError;
import com.example.employee.models.Role;
import com.example.employee.models.SearchResult;
import com.example.employee.models.dtos.RoleDTO;
import com.example.employee.services.RoleService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

	private RoleService roleService;

	public RoleController(RoleService roleService) {
		this.roleService = roleService;
	}

	@GetMapping()
	public ResponseEntity<List<RoleDTO>> getAllRoles() {
		List<RoleDTO> roles = roleService.getAll();

		return ResponseEntity.ok().body(roles);
	}

	@GetMapping("/get-one/{roleId}")
	public ResponseEntity<RoleDTO> getRoleById(@PathVariable Integer roleId) {
		RoleDTO role = roleService.getById(roleId);
		if (role == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok().body(role);
		}

	}

	@GetMapping("/search")
	public ResponseEntity<SearchResult<RoleDTO>> searchRoles(@ModelAttribute RoleSearchCriteria criteria,
			Pageable pageable) {
		return ResponseEntity.ok().body(roleService.search(criteria, pageable));
	}

	@PostMapping("/create")
	public ResponseEntity<RoleDTO> saveRole(@RequestBody Role role) {
		RoleDTO newRole = roleService.save(role);
		return ResponseEntity.ok().body(newRole);
	}

	@PutMapping("/update")
	public ResponseEntity<RoleDTO> updateRole(@RequestBody Role role) {
		RoleDTO newRole = roleService.save(role);
		return ResponseEntity.ok().body(newRole);
	}

	@DeleteMapping("/delete/{roleId}")
	public ResponseEntity<Void> deleteRole(@PathVariable Integer roleId) {
		roleService.delete(roleId);
		return ResponseEntity.ok().body(null);
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(PropertyReferenceException.class)
	public ApiError handleSortExceptions(PropertyReferenceException ex) {
		String message = "";
		if (ex.getMessage().equals("No property 'string' found for type 'Role'")) {
			message = "Parameter value is unsuported. Please use desc or asc";
		}
		return ApiError.builder().message(message).status(400).build();
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoSuchElementException.class)
	public ApiError handleNotFoundExceptions(NoSuchElementException ex) {
		String message = "There is no role with submitted id";
		return ApiError.builder().message(message).field("id").status(404).build();
	}
}
