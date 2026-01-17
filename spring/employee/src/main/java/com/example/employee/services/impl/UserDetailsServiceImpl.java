package com.example.employee.services.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.employee.criteria.RoleSearchCriteria;
import com.example.employee.criteria.UserSearchCriteria;
import com.example.employee.models.CustomUserDetails;
import com.example.employee.models.Role;
import com.example.employee.models.User;
import com.example.employee.repositories.RoleRepository;
import com.example.employee.repositories.UserRepository;
import com.example.employee.services.RoleService;
import com.example.employee.services.UserService;
import com.example.employee.utils.CommonUtils;

@SuppressWarnings("unused")
@Component
public class UserDetailsServiceImpl implements UserDetailsService {

	private RoleService roleService;
	private UserService userService;

	private Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

	public UserDetailsServiceImpl(UserService userService, RoleService roleService) {
		this.userService = userService;
		this.roleService = roleService;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		logger.info("Searching for user with username: {}", username);
		UserSearchCriteria userCriteria = new UserSearchCriteria();
		userCriteria.setUsername(username);
		User user = userService.searchEntities(userCriteria).get(0);
		if (user == null) {
			logger.error("User with username: {} is not found.", username);
			throw new UsernameNotFoundException("could not found user..!!");
		}
		RoleSearchCriteria criteria = new RoleSearchCriteria();
		criteria.setUserId(user.getId());
		
		List<Role> roles = roleService.searchEntities(criteria);
		List<GrantedAuthority> auths = CommonUtils.convetRolesToAuthorities(roles);
		return new CustomUserDetails(user, auths);
	}

}
