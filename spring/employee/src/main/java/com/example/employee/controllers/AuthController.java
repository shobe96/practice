package com.example.employee.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.models.ApiError;
import com.example.employee.models.AuthRequest;
import com.example.employee.models.AuthResponse;
import com.example.employee.models.RegisterRequest;
import com.example.employee.models.dtos.UserDTO;
import com.example.employee.services.UserService;
import com.example.employee.utils.CustomAuthenticationManager;
import com.example.employee.utils.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private JwtUtil jwtUtil;
	private UserService userService;
	private CustomAuthenticationManager customAuthenticationManager;

	public AuthController(JwtUtil jwtUtil, UserService userService,
			CustomAuthenticationManager customAuthenticationManager) {
		this.jwtUtil = jwtUtil;
		this.userService = userService;
		this.customAuthenticationManager = customAuthenticationManager;
	}

	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody AuthRequest user) {
		Authentication authentication = customAuthenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
		if (authentication != null) {
			AuthResponse token = jwtUtil.generateToken(authentication);
			if (token != null) {
				return ResponseEntity.ok().body(token);
			} else {
				ApiError apiError = ApiError.builder().status(HttpStatus.UNAUTHORIZED.value()).message("Wrong credentials!").build();
				return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
			}
		} else {
			ApiError apiError = ApiError.builder().status(HttpStatus.UNAUTHORIZED.value()).message("Wrong credentials!").build();
			return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
		}

	}

	@PostMapping("/register-user")
	public ResponseEntity<Object> registerUser(@RequestBody() RegisterRequest request) {
		UserDTO user = userService.registerUser(request);
		if (user == null) {
			ApiError apiError = ApiError.builder().status(HttpStatus.BAD_REQUEST.value()).message("Username is already taken!").build();
			return ResponseEntity.badRequest().body(apiError);
		} else {
			return ResponseEntity.ok().body(user);
		}
	}
}
