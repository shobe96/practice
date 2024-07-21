package com.example.employee.utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

import com.example.employee.models.Role;
import com.example.employee.models.User;
import com.example.employee.repositories.UserRepository;

@Component
public class CustomAuthenticationManager implements AuthenticationManager {

	private UserRepository userRepository;
	// https://medium.com/spring-framework/spring-security-authentication-process-explained-in-detailed-5bc0a424a746

	@Autowired
	public CustomAuthenticationManager(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		// TODO Auto-generated method stub
		User user = userRepository.findByUsername(authentication.getName());
		if (user != null) {
			String passwordHash = BCrypt.hashpw(authentication.getCredentials().toString(), user.getSalt());
			if (user.getPassword().equals(passwordHash)) {			
				List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
				for (Role role : user.getRoles()) {
					grantedAuthorityList.add(new SimpleGrantedAuthority(role.getCode()));
				}
				return new UsernamePasswordAuthenticationToken(authentication.getPrincipal(),
						authentication.getCredentials(), grantedAuthorityList);
			} else {
				return null;
			}
			
		} else {
			return null;
		}
		/*
		 * Optional<User> user = userRepo.findByUserName(authentication.getName()); if
		 * (user.isPresent()) { if
		 * (passwordEncoder.matches(authentication.getCredentials().toString(),
		 * user.get().getPassword())) { List<GrantedAuthority> grantedAuthorityList =
		 * new ArrayList<>(); for (Role role : user.get().getRoleSet()) {
		 * grantedAuthorityList.add(new SimpleGrantedAuthority(role.getName())); }
		 * return new UsernamePasswordAuthenticationToken(authentication.getPrincipal(),
		 * authentication.getCredentials(), grantedAuthorityList); } else { throw new
		 * BadCredentialsException("Wrong Password"); } } else { throw new
		 * BadCredentialsException("Wrong UserName"); } }
		 */
	}

}
