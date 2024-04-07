package com.example.employee.services;

import com.example.employee.models.User;

public interface UserService {
	User loadUserByUsername(String login, String password);
}
