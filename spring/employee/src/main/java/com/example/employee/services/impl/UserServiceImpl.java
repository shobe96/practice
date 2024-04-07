package com.example.employee.services.impl;

import org.springframework.stereotype.Service;

import com.example.employee.models.User;
import com.example.employee.repositories.UserRepository;
import com.example.employee.services.UserService;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	public UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public User loadUserByUsername(String login, String password) {
		User user = userRepository.findByLoginAndPassword(login, password);
		
		return null;
	}

}
