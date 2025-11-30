package com.example.employee.services;

import org.springframework.security.core.Authentication;

import com.example.employee.models.RegisterRequest;
import com.example.employee.models.User;

public interface UserService extends BaseService<User, Integer>{

	public User registerUser(RegisterRequest request);
	
	public Authentication getAuthenticatedUser(Authentication authentication);
}
