package com.example.employee.controllers;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.criteria.UserSearchCriteria;
import com.example.employee.models.SearchResult;
import com.example.employee.models.User;
import com.example.employee.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping()
	public ResponseEntity<List<User>> getAllUsers(Pageable pageable) {
		List<User> userSearchResult = userService.getAll();
		return ResponseEntity.ok().body(userSearchResult);
	}

	@GetMapping("/search")
	public ResponseEntity<SearchResult<User>> searchEmployees(@ModelAttribute UserSearchCriteria criteria,
			Pageable pageable) {
		return ResponseEntity.ok().headers(new HttpHeaders()).body(userService.search(criteria, pageable));
	}
}
