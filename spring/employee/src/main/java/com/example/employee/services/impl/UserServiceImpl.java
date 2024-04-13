package com.example.employee.services.impl;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.employee.models.Role;
import com.example.employee.models.User;
import com.example.employee.repositories.RoleRepository;
import com.example.employee.repositories.UserRepository;
import com.example.employee.services.UserService;

@Service
public class UserServiceImpl implements UserService {

//	private final UserRepository userRepository;
//
//	private final RoleRepository roleRepository;
//
//	public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
//		this.userRepository = userRepository;
//		this.roleRepository = roleRepository;
//	}
//
//	@Override
//	public UserDetails loadUserByUsername(String login, String password) {
//		User user = userRepository.findByLoginAndPassword(login, password);
//		List<Role> roles = roleRepository.getRolesByUserId(user.getId());
//		UserDetails userDetails = org.springframework.security.core.userdetails.User.builder().username(user.getLogin())
//				.password(user.getPassword()).roles(getRolesCodes(roles)).build();
//		return userDetails;
//	}
//
//	private String[] getRolesCodes(List<Role> roles) {
//		String[] rolesCodes = new String[roles.size()];
//		int index = 0;
//		for (Role role : roles) {
//			rolesCodes[index] = role.getCode();
//			index++;
//		}
//		return rolesCodes;
//	}

}
