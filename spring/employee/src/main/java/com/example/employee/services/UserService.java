package com.example.employee.services;

import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import com.example.employee.models.RegisterRequest;
import com.example.employee.models.SearchResult;
import com.example.employee.models.User;

public interface UserService {

	public User registerUser(RegisterRequest request);
	
	public SearchResult<User> getAllUsers(Pageable pageable);
	
	public void deleteUser(Integer userId);
	
	public Authentication getAuthenticatedUser(Authentication authentication);

	public SearchResult<User> searchUsers(String username, Pageable pageable);
}
