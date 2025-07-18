package com.example.employee.services.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.employee.models.Employee;
import com.example.employee.models.RegisterRequest;
import com.example.employee.models.SearchResult;
import com.example.employee.models.User;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.repositories.UserRepository;
import com.example.employee.services.UserService;
import com.example.employee.utils.CommonUtils;

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
	public SearchResult<User> getAllUsers(Pageable pageable) {
		SearchResult<User> userSearchResult = new SearchResult<>();
		userSearchResult.setSize(userRepository.count());
		userSearchResult.setItems(userRepository.findAll(pageable).getContent());
		return userSearchResult;
	}

	@Override
	public void deleteUser(Integer userId) {
		Optional<User> optional = userRepository.findById(userId);
		if (optional.isPresent()) {
			Employee employee = optional.get().getEmployee();
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
				List<GrantedAuthority> grantedAuthorityList = CommonUtils.convetRolesToAuthorities(authenticateUser.getRoles());
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

	@Override
	public SearchResult<User> searchUsers(String username, Pageable pageable) {
		if (username == null) {
			username = "";
		}
		SearchResult<User> userSearchResult = new SearchResult<>();
		List<User> users = userRepository.searchUsers(username, pageable).getContent();
		userSearchResult.setItems(users);
		userSearchResult.setSize(userRepository.searchResultCount(username));
		return userSearchResult;
	}
}
