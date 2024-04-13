package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

@Component
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username);
		List<Role> roles = roleRepository.getRolesByUserId(user.getId());
		if (user.equals(null)) {
			System.out.println("Username not found: " + username);
			throw new UsernameNotFoundException("could not found user..!!");
		}
		List<GrantedAuthority> auths = new ArrayList<>();
		if (roles != null && roles.size() > 0) {
			for (Role role : roles) {
				auths.add(new SimpleGrantedAuthority(role.getCode()));
			}
		}
		return new CustomUserDetails(user, auths);
	}

}
