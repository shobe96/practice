package com.example.employee.controllers.advice;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.example.employee.models.ApiError;

@ControllerAdvice
public class AuthControllerAdvice {
	
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(UsernameNotFoundException.class)
	public ApiError handleTokenExpiredException(UsernameNotFoundException ex) {
		String message = ex.getMessage();
		return ApiError.builder().message(message).status(401).build();
	}

}
