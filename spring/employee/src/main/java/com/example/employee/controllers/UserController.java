package com.example.employee.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.models.UserSearchResult;
import com.example.employee.services.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/users")
public class UserController {

	private UserService userService;

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping()
	public ResponseEntity<UserSearchResult> getAllUsers(Pageable pageable) {
		UserSearchResult userSearchResult = userService.getAllUsers(pageable);
		return ResponseEntity.ok().body(userSearchResult);
	}

	@GetMapping("/search")
	public ResponseEntity<UserSearchResult> searchEmployees(@RequestParam(required = false) String username,
			Pageable pageable) {
		return ResponseEntity.ok().headers(new HttpHeaders()).body(userService.searchUsers(username, pageable));
	}
}
