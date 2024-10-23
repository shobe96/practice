package com.example.employee.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.example.employee.models.Role;
import com.example.employee.models.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

public class CommonUtils {

	private static Logger logger = LoggerFactory.getLogger(CommonUtils.class);

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

	public static <T> T mapObjectToClass(Object object, String classToMap) {
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		ObjectMapper objectMapper = new ObjectMapper();
		T result;
		try {
			String json = ow.writeValueAsString(object);
			switch (classToMap) {
			case ClassesConstants.USER: {
				User.class.cast(object);
				User user = objectMapper.readValue(json, User.class);
				return (T) user;
			}
			default:
				return null;
			}
		} catch (JsonProcessingException e) {
			logger.error(e.getMessage());
			return null;
		}
	}
}
