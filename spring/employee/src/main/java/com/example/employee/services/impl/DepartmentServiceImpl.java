package com.example.employee.services.impl;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Service;

import com.example.employee.mappers.BaseMapper;
import com.example.employee.mappers.DepartmentMapper;
import com.example.employee.models.Department;
import com.example.employee.models.dtos.DepartmentDTO;
import com.example.employee.repositories.DepartmentRepository;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.services.DepartmentService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class DepartmentServiceImpl extends BaseServiceImpl<Department, DepartmentDTO, Integer> implements DepartmentService {

	private DepartmentRepository departmentRepository;
	private EmployeeRepository employeeRepository;
	private DepartmentMapper departmentMapper;

	@Override
	protected JpaRepository<Department, Integer> getRepository() {
		return departmentRepository;
	}

	@Override
	protected JpaSpecificationExecutor<Department> getSpecificationExecutor() {
		return departmentRepository;
	}
	
	@Override
	protected BaseMapper<Department, DepartmentDTO> getMapper() {
		return departmentMapper;
	}

	public DepartmentServiceImpl(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository, DepartmentMapper departmentMapper) {
		super();
		this.departmentRepository = departmentRepository;
		this.employeeRepository = employeeRepository;
		this.departmentMapper = departmentMapper;
	}

	@Override
	public void delete(Integer id) {
		Department departmentToDelete = getEntityById(id).get();
		employeeRepository.unassignEmployeesFromDepartment(id);
		deleteEntity(departmentToDelete);
	}
//
//	@Override
//	public SearchResult<Department> getAllDepartments(Pageable pageable) {
//		SearchResult<Department> departmentSearchResult = new SearchResult<>();
//		List<Department> departments = departmentRepository.findAll(pageable).getContent();
//		if (departments.isEmpty()) {
//			Pageable newPage = PageRequest.of((pageable.getPageNumber() - 1), pageable.getPageSize());
//			departments = departmentRepository.findAll(newPage).getContent();
//		}
//		departmentSearchResult.setItems(departments);
//		departmentSearchResult.setSize(departmentRepository.count());
//		return departmentSearchResult;
//	}
//
//	@Override
//	public Department getDepartmentById(Integer departmentId) {
//		Optional<Department> optional = departmentRepository.findById(departmentId);
//		if (optional.isPresent()) {
//			return optional.get();
//		} else {
//			return null;
//		}
//	}
//
//	@Override
//	public Department getByDepartmentName(String departmentName) {
//		return departmentRepository.findByName(departmentName);
//	}
//
//	@Override
//	public Department saveDepartment(Department department) {
//		return departmentRepository.save(department);
//	}
//
//	@Override
//	public Department updateDepartment(Department department) {
//		return departmentRepository.save(department);
//	}
//
//	@Override
//	public void deleteDepartment(Integer departmentId) {
//		Department department = getDepartmentById(departmentId);
//		employeeRepository.unassignEmployeesFromDepartment(departmentId);
//		departmentRepository.delete(department);
//	}
//
//	@Override
//	public List<Department> getAllDepartments() {
//		List<Department> departments = new ArrayList<>();
//		departmentRepository.findAll().forEach(departments::add);
//		return departments;
//	}
//
//	@Override
//	public SearchResult<Department> searchDepartments(DepartmentCriteria criteria, Pageable pageable) {
//		SearchResult<Department> departmentSearchResult = new SearchResult<>();
//		departmentSearchResult.setItems(departmentRepository.searchDepartments(name, pageable).getContent());
//		departmentSearchResult.setSize(departmentRepository.searchResultCount(name));
//		return departmentSearchResult;
//	}

	

}
