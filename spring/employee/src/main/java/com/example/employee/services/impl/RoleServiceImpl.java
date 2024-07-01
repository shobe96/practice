package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

	@Override
	public RoleSearchResult getAllRoles(Pageable pageable) {
		RoleSearchResult roleSearchResult = new RoleSearchResult();
		List<Role> roles = roleRepository.findAll(pageable).getContent();
		if (roles.isEmpty()) {
			Pageable newPage = PageRequest.of((pageable.getPageNumber() - 1), pageable.getPageSize());
			roles = roleRepository.findAll(newPage).getContent();
		}
		roleSearchResult.setSize(roleRepository.count());
		roleSearchResult.setRoles(roles);
		return roleSearchResult;
	}

	@Override
	public Role getRoleById(Integer roleId) {
		Optional<Role> optional = roleRepository.findById(roleId);
		if (optional.isPresent()) {
			return optional.get();
		} else {
			return null;
		}
	}

	@Override
	public Role saveRole(Role role) {
		return roleRepository.save(role);
	}

	@Override
	public Role updateRole(Role role) {
		return roleRepository.save(role);
	}

	@Override
	public void deleteRole(Integer roleId) {
		Role role = getRoleById(roleId);
		roleRepository.delete(role);
		
	}

	@Override
	public RoleSearchResult searchRoles(String name, Pageable pageable) {
		if (name == null) {
			name = "";
		}
		RoleSearchResult roleSearchResult = new RoleSearchResult();
		List<Role> roles = roleRepository.searchRoles(name, pageable).getContent();
		roleSearchResult.setRoles(roles);
		roleSearchResult.setSize(roleRepository.searchResultCount(name));
		return roleSearchResult;
	}

}
