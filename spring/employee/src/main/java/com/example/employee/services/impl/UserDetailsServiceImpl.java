package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.employee.models.CustomUserDetails;
import com.example.employee.models.Role;
import com.example.employee.models.User;
import com.example.employee.repositories.RoleRepository;
import com.example.employee.repositories.UserRepository;

@SuppressWarnings("unused")
@Component
public class UserDetailsServiceImpl implements UserDetailsService {

	private UserRepository userRepository;
	private RoleRepository roleRepository;

	private Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

	@Autowired
	public UserDetailsServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		logger.info("Searching for user with username: {}", username);
		//TODO: extrach by username and password
		User user = userRepository.findByUsername(username);
		if (user == null) {
			logger.error("User with username: {} is not found.", username);
			throw new UsernameNotFoundException("could not found user..!!");
		}
		List<Role> roles = roleRepository.getRolesByUserId(user.getId());
		List<GrantedAuthority> auths = new ArrayList<>();
		if (roles != null && !roles.isEmpty()) {
			for (Role role : roles) {
				auths.add(new SimpleGrantedAuthority(role.getCode()));
			}
		}
		return new CustomUserDetails(user, auths);
	}

}
