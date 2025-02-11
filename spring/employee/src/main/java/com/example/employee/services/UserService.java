package com.example.employee.services;

import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import com.example.employee.models.RegisterRequest;
import com.example.employee.models.User;
import com.example.employee.models.UserSearchResult;

public interface UserService {

	public User registerUser(RegisterRequest request);
	
	public UserSearchResult getAllUsers(Pageable pageable);
	
	public void deleteUser(Integer userId);
	
	public Authentication getAuthenticatedUser(Authentication authentication);

	public UserSearchResult searchUsers(String username, Pageable pageable);
}
