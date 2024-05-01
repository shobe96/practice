package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.employee.models.Role;
import com.example.employee.models.RoleSearchResult;
import com.example.employee.repositories.RoleRepository;
import com.example.employee.services.RoleService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

	RoleRepository roleRepository;

	@Autowired
	public RoleServiceImpl(RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}

	@Override
	public RoleSearchResult getAllRoles() {
		RoleSearchResult roleSearchResult = new RoleSearchResult();
		List<Role> roles = new ArrayList<>();
		roleRepository.findAll().forEach(roles::add);
		roleSearchResult.setRoles(roles);
		roleSearchResult.setSize(roleRepository.count());
		return roleSearchResult;
	}

}
