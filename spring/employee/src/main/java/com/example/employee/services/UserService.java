package com.example.employee.services;

import org.springframework.security.core.Authentication;

import com.example.employee.models.RegisterRequest;
import com.example.employee.models.User;
import com.example.employee.models.dtos.UserDTO;

public interface UserService extends BaseService<User, UserDTO, Integer>{

	public UserDTO registerUser(RegisterRequest request);
	
	public Authentication getAuthenticatedUser(Authentication authentication);
}
