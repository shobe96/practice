package com.example.employee.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
	public ResponseEntity<RoleSearchResult> getAllRoles(@RequestParam() Boolean all) {
		RoleSearchResult roles = roleService.getAllRoles();
		return ResponseEntity.ok().body(roles);
	}
}
