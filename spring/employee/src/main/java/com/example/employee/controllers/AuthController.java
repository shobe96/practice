package com.example.employee.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.models.AuthRequest;
import com.example.employee.models.AuthResponse;
import com.example.employee.models.RegisterRequest;
import com.example.employee.models.RestError;
import com.example.employee.models.User;
import com.example.employee.services.UserService;
import com.example.employee.utils.CustomAuthenticationManager;
import com.example.employee.utils.JwtUtil;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/auth")
public class AuthController {

	private AuthenticationManager authenticationManager;
	private JwtUtil jwtUtil;
	private UserService userService;
	private CustomAuthenticationManager customAuthenticationManager;

	@Autowired
	public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService,
			CustomAuthenticationManager customAuthenticationManager) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		this.userService = userService;
		this.customAuthenticationManager = customAuthenticationManager;
	}

	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody AuthRequest user) {
		Authentication authentication = customAuthenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
//		authenticationManager
//				.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
		if (authentication != null) {
			AuthResponse token = jwtUtil.generateToken(user.getUsername(), user.getPassword());
			if (token != null) {
				return ResponseEntity.ok().body(token);
			} else {
				RestError restError = new RestError(401, "Unauthorized", false, "HttpErrorResponse",
						"Wrong credentials!");
				return new ResponseEntity<Object>(restError, HttpStatus.UNAUTHORIZED);
			}
		} else {
			RestError restError = new RestError(401, "Unauthorized", false, "HttpErrorResponse",
					"Wrong credentials!");
			return new ResponseEntity<Object>(restError, HttpStatus.UNAUTHORIZED);
		}

	}

	@PostMapping("/register-user")
	public ResponseEntity<Object> registerUser(@RequestBody() RegisterRequest request) {
		User user = userService.registerUser(request);
		if (user == null) {
			RestError restError = new RestError(400, "Bad request", false, "HttpErrorResponse",
					"Username is already taken!");
			return ResponseEntity.badRequest().body(restError);
		} else {
			return ResponseEntity.ok().body(user);
		}
	}

	@DeleteMapping("/delete/{userId}")
	public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
		userService.deleteUser(userId);
		return ResponseEntity.ok().body(null);
	}
}
