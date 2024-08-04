package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.employee.models.Employee;
import com.example.employee.models.RegisterRequest;
import com.example.employee.models.Role;
import com.example.employee.models.User;
import com.example.employee.models.UserSearchResult;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.repositories.UserRepository;
import com.example.employee.services.UserService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

	private UserRepository userRepository;
	private EmployeeRepository employeeRepository;
	private Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

	@Autowired
	public UserServiceImpl(UserRepository userRepository, EmployeeRepository employeeRepository) {
		this.userRepository = userRepository;
		this.employeeRepository = employeeRepository;
	}

	@Override
	public User registerUser(RegisterRequest request) {
		//TODO: save salt for user that is registered
		try {
			User user = null;
			String salt = BCrypt.gensalt(12);
			user = userRepository.findByUsername(request.getUsername());
			if (user == null) {
				user = new User();
				user.setUsername(request.getUsername());
				user.setPassword(hash(request.getPassword(), salt));
				user.setSalt(salt);
				user.setRoles(request.getRoles());
				user = userRepository.save(user);
				Employee employee = request.getEmployee();
				employee.setUser(user);
				employeeRepository.save(employee);
				
				return user;
			} else {
				return null;
			}

		} catch (Exception e) {
			logger.error(e.getMessage());
			return null;
		}
	}

	public String hash(String password, String salt) {
		return BCrypt.hashpw(password, salt);
	}

	@Override
	public UserSearchResult getAllUsers(Pageable pageable) {
		UserSearchResult userSearchResult = new UserSearchResult();
		userSearchResult.setSize(userRepository.count());
		userSearchResult.setUsers(userRepository.findAll(pageable).getContent());
		return userSearchResult;
	}

	@Override
	public void deleteUser(Integer userId) {
		Optional<User> optional = userRepository.findById(userId);
		if (optional.isPresent()) {
			Employee employee = employeeRepository.findByUserId(userId);
			if (employee != null) {
				employee.setUser(null);
				employeeRepository.save(employee);
			}
			userRepository.delete(optional.get());
		}
		
	}

	@Override
	public Authentication getAuthenticatedUser(Authentication authentication) {
		User authenticateUser = userRepository.findByUsername(authentication.getName());
		if (authenticateUser != null) {
			String passwordHash = BCrypt.hashpw(authentication.getCredentials().toString(), authenticateUser.getSalt());
			if (authenticateUser.getPassword().equals(passwordHash)) {			
				List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
				for (Role role : authenticateUser.getRoles()) {
					grantedAuthorityList.add(new SimpleGrantedAuthority(role.getCode()));
				}
				UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(authentication.getPrincipal(),
						authentication.getCredentials(), grantedAuthorityList);
				authenticationToken.setDetails(authenticateUser);
				return authenticationToken;
			} else {
				return null;
			}
			
		} else {
			return null;
		}
	}
}
