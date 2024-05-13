package com.example.employee.controllers.advice;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class AuthControllerAdvice {
	
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(UsernameNotFoundException.class)
	public Map<String, String> handleTokenExpiredException(UsernameNotFoundException ex) {
		Map<String, String> errors = new HashMap<>();
		String message = ex.getMessage();
		String field = "auth";
		errors.put(field, message);
		return errors;
	}

}
