package com.example.employee.models;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
	private String username;
	private String password;
	private Set<Role> roles;
	private Employee employee;
}
