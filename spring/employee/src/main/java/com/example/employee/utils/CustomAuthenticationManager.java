package com.example.employee.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import com.example.employee.models.User;
import com.example.employee.services.UserService;

@Component
public class CustomAuthenticationManager implements AuthenticationManager {

	private UserService userService;
	// https://medium.com/spring-framework/spring-security-authentication-process-explained-in-detailed-5bc0a424a746
	private User authenticateUser;
	@Autowired
	public CustomAuthenticationManager(UserService userServiceImpl) {
		this.userService = userServiceImpl;
	}

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		return userService.getAuthenticatedUser(authentication);
	}

	public User getAuthenticateUser() {
		return authenticateUser;
	}

	public void setAuthenticateUser(User authenticateUser) {
		this.authenticateUser = authenticateUser;
	}

}
