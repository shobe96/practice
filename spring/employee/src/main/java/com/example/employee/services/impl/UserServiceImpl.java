package com.example.employee.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.employee.models.Employee;
import com.example.employee.models.RegisterRequest;
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
		try {
			User user = null;
			user = userRepository.findByUsername(request.getUsername());
			if (user == null) {
				user = new User();
				user.setUsername(request.getUsername());
				user.setPassword(hash(request.getPassword()));
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

	public String hash(String password) {
		return BCrypt.hashpw(password, BCrypt.gensalt(12));
	}

	@Override
	public UserSearchResult getAllUsers(Pageable pageable) {
		UserSearchResult userSearchResult = new UserSearchResult();
		userSearchResult.setSize(userRepository.count());
		userSearchResult.setUsers(userRepository.findAll(pageable).getContent());
		return userSearchResult;
	}
}
