package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Employee;
import com.example.employee.models.EmployeeSearchResult;
import com.example.employee.models.Skill;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.repositories.ProjectHistoryRepository;
import com.example.employee.services.EmployeeService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

	EmployeeRepository employeeRepository;
	ProjectHistoryRepository projectHistoryRepository;

	@Autowired
	public EmployeeServiceImpl(EmployeeRepository employeeRepository, ProjectHistoryRepository projectHistoryRepository) {
		this.employeeRepository = employeeRepository;
		this.projectHistoryRepository = projectHistoryRepository;
	}

	@Override
	public EmployeeSearchResult getAllEmployees(Pageable pageable) {
		EmployeeSearchResult employeeSearchResult = new EmployeeSearchResult();
		List<Employee> employees = employeeRepository.findAll(pageable).getContent();
		if (employees.isEmpty()) {
			Pageable newPage = PageRequest.of((pageable.getPageNumber() - 1), pageable.getPageSize());
			employees = employeeRepository.findAll(newPage).getContent();
		}
		employeeSearchResult.setSize(employeeRepository.count());
		employeeSearchResult.setEmployees(employees);
		return employeeSearchResult;
	}

	@Override
	public Employee getEmployeebyId(Integer employeeId) {
		Optional<Employee> optional = employeeRepository.findById(employeeId);
		if (optional.isPresent()) {
			return optional.get();
		} else {
			return null;
		}
	}

	@Override
	public EmployeeSearchResult getEmployeeByDepartmentId(Pageable pageable, Integer departmentId) {
		EmployeeSearchResult employeeSearchResult = new EmployeeSearchResult();
		employeeSearchResult.setEmployees(employeeRepository.findAllByDepartmentId(pageable, departmentId).getContent());
		Long size = (long) employeeRepository.findAllByDepartmentId(departmentId).size();
		employeeSearchResult.setSize(size);
		return employeeSearchResult;
	}

	@Override
	public Employee saveEmployee(Employee employee) {
		return employeeRepository.save(employee);
	}

	@Override
	public Employee updateEmployee(Employee employee) {
		return employeeRepository.save(employee);
	}

	@Override
	public void deleteEmployee(Integer employeeId) {
		Employee employee = getEmployeebyId(employeeId);
		employeeRepository.deleteEmployeeProjects(employeeId);
		projectHistoryRepository.deleteProjectHistoryByEmployee(employeeId);
		employeeRepository.delete(employee);
	}

	@Override
	public List<Employee> filterByActive(Boolean active) {
		List<Employee> employees = new ArrayList<>();
		employeeRepository.findAll().forEach(employees::add);
		employees.removeIf(employee -> employee.getActive().equals(active));
		return employees;
	}

	@Override
	public EmployeeSearchResult searcEmployees(String name, String surname, String email, Pageable pageable) {
		if (name == null) {
			name = "";
		}
		if (surname == null) {
			surname = "";
		}
		if (email == null) {
			email = "";
		}
		EmployeeSearchResult employeeSearchResult = new EmployeeSearchResult();
		List<Employee> employees = employeeRepository.searchEmployees(name, surname, email, pageable).getContent();
		employeeSearchResult.setEmployees(employees);
		employeeSearchResult.setSize(employeeRepository.searchResultCount(name, surname, email));
		return employeeSearchResult;
	}

	@Override
	public List<Employee> getAllEmployees() {
		return employeeRepository.findEmployeesWithoutUser();
	}

	@Override
	public List<Employee> filterEmployeesByActiveAndSkills(List<Skill> skills, Integer departmentId) {
		List<Integer> skillIds = new ArrayList<>();
		for (Skill skill : skills) {
			skillIds.add(skill.getId());
		}
		return employeeRepository.filterEmployeesByActiveAndSkills(skillIds, departmentId);
	}

	@Override
	public Employee findByUserId(Integer userId) {
		return employeeRepository.findByUserId(userId);
	}
}
