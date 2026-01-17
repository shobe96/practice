package com.example.employee.models.dtos;

import java.util.HashSet;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
	private Integer id;
	private String username;
	private Set<RoleDTO> roles = new HashSet<>();
}
