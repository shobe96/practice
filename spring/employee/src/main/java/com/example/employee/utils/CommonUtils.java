package com.example.employee.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.example.employee.models.Role;

public class CommonUtils {

	private static Logger logger = LoggerFactory.getLogger(CommonUtils.class);

	private CommonUtils() {
		//Add a private constructor to hide the implicit public one.
	}

	public static List<GrantedAuthority> convetRolesToAuthorities(Collection<Role> roles) {
		List<GrantedAuthority> auths = new ArrayList<>();
		if (roles != null && !roles.isEmpty()) {
			for (Role role : roles) {
				auths.add(new SimpleGrantedAuthority(role.getCode()));
			}
		} else {
			logger.error("Failed to obtain roles");
		}
		return auths;
	}
}
