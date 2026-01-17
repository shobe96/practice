package com.example.employee.services.impl;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Service;

import com.example.employee.mappers.BaseMapper;
import com.example.employee.mappers.RoleMapper;
import com.example.employee.models.Role;
import com.example.employee.models.dtos.RoleDTO;
import com.example.employee.repositories.RoleRepository;
import com.example.employee.services.RoleService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class RoleServiceImpl extends BaseServiceImpl<Role, RoleDTO, Integer> implements RoleService {

	RoleRepository roleRepository;
	RoleMapper roleMapper;

	public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
		super();
		this.roleRepository = roleRepository;
		this.roleMapper = roleMapper;
	}

	@Override
	protected JpaRepository<Role, Integer> getRepository() {
		return roleRepository;
	}

	@Override
	protected JpaSpecificationExecutor<Role> getSpecificationExecutor() {
		return roleRepository;
	}

	@Override
	protected BaseMapper<Role, RoleDTO> getMapper() {
		return roleMapper;
	}

//	@Override
//	public SearchResult<Role> getAllRoles() {
//		SearchResult<Role> roleSearchResult = new SearchResult<Role>();
//		List<Role> roles = new ArrayList<>();
//		roleRepository.findAll().forEach(roles::add);
//		roleSearchResult.setItems(roles);
//		roleSearchResult.setSize(roleRepository.count());
//		return roleSearchResult;
//	}
//
//	@Override
//	public SearchResult<Role> getAllRoles(Pageable pageable) {
//		SearchResult<Role> roleSearchResult = new SearchResult<>();
//		List<Role> roles = roleRepository.findAll(pageable).getContent();
//		if (roles.isEmpty()) {
//			Pageable newPage = PageRequest.of((pageable.getPageNumber() - 1), pageable.getPageSize());
//			roles = roleRepository.findAll(newPage).getContent();
//		}
//		roleSearchResult.setSize(roleRepository.count());
//		roleSearchResult.setItems(roles);
//		return roleSearchResult;
//	}
//
//	@Override
//	public Role getRoleById(Integer roleId) {
//		Optional<Role> optional = roleRepository.findById(roleId);
//		if (optional.isPresent()) {
//			return optional.get();
//		} else {
//			return null;
//		}
//	}
//
//	@Override
//	public Role saveRole(Role role) {
//		return roleRepository.save(role);
//	}
//
//	@Override
//	public Role updateRole(Role role) {
//		return roleRepository.save(role);
//	}
//
//	@Override
//	public void deleteRole(Integer roleId) {
//		Role role = getRoleById(roleId);
//		roleRepository.delete(role);
//		
//	}
//
//	@Override
//	public SearchResult<Role> searchRoles(String name, Pageable pageable) {
//		if (name == null) {
//			name = "";
//		}
//		SearchResult<Role> roleSearchResult = new SearchResult<>();
//		List<Role> roles = roleRepository.searchRoles(name, pageable).getContent();
//		roleSearchResult.setItems(roles);
//		roleSearchResult.setSize(roleRepository.searchResultCount(name));
//		return roleSearchResult;
//	}

}
