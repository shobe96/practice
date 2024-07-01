package com.example.employee.controllers;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.example.employee.models.Role;
import com.example.employee.models.RoleSearchResult;
import com.example.employee.services.RoleService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/roles")
public class RoleController {

	private RoleService roleService;

	@Autowired
	public RoleController(RoleService roleService) {
		this.roleService = roleService;
	}

	@GetMapping()
	public ResponseEntity<RoleSearchResult> getAllRoles(Pageable pageable, @RequestParam() Boolean all) {
		RoleSearchResult roles;
		if (all.equals(true)) {
			roles = roleService.getAllRoles();
		} else {
			roles = roleService.getAllRoles(pageable);
		}
		return ResponseEntity.ok().body(roles);
	}
	
	@GetMapping("/get-one/{roleId}")
	public ResponseEntity<Role> getRoleById(@PathVariable Integer roleId) {
		Role role = roleService.getRoleById(roleId);
		if (role == null) {
			return ResponseEntity.notFound().build();
		} else {			
			return ResponseEntity.ok().body(role);
		}
		
	}
	
	@GetMapping("/search")
	public ResponseEntity<RoleSearchResult> search(@RequestParam(required = false) String name,
			Pageable pageable) {
		return ResponseEntity.ok().body(roleService.searchRoles(name, pageable));
	}
	
	@PostMapping("/create")
	public ResponseEntity<Role> saveRole(@RequestBody Role role) {
		Role newRole = roleService.saveRole(role);
		return ResponseEntity.ok().body(newRole);
	}

	@PutMapping("/update")
	public ResponseEntity<Role> updateRole(@RequestBody Role role) {
		Role newRole = roleService.updateRole(role);
		return ResponseEntity.ok().body(newRole);
	}

	@DeleteMapping("/delete/{roleId}")
	public ResponseEntity<Void> deleteRole(@PathVariable Integer roleId) {
		roleService.deleteRole(roleId);
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
		if (ex.getMessage().equals("No property 'string' found for type 'Role'")) {
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
		String message = "There is no role with submitted id";
		String field = "role";
		errors.put(field, message);
		return errors;
	}
}
