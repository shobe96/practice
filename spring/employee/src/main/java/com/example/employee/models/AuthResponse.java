package com.example.employee.models;

import java.util.Date;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {

	private String token;
	private Date issueDate;
	private Date expirationDate;
	private Long expiration;
	private String username;
	private Integer userId;
	private Set<Role> roles;
}
