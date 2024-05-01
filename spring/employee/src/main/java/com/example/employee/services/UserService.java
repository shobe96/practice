package com.example.employee.services;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.RegisterRequest;
import com.example.employee.models.User;
import com.example.employee.models.UserSearchResult;

public interface UserService {

	public User registerUser(RegisterRequest request);
	
	public UserSearchResult getAllUsers(Pageable pageable);
}
