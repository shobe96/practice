package com.example.employee.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.example.employee.criteria.EmployeeSearchCriteria;
import com.example.employee.models.Department;
import com.example.employee.models.Employee;
import com.example.employee.models.dtos.EmployeeDTO;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.repositories.ProjectHistoryRepository;
import com.example.employee.services.impl.EmployeeServiceImpl;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceUnitTest {

	@InjectMocks
	private EmployeeServiceImpl employeeService;

	@Mock
	private EmployeeRepository employeeRepository;
	
	@Mock
	private ProjectHistoryRepository projectHistoryRepository;

	@Test
	void getAllEmployeesTest() {
		List<Employee> employees = new ArrayList<Employee>();
		Employee employee = new Employee();
		employee.setName("Test");
		employee.setSurname("Test");
		employees.add(employee);

		Pageable pageable = PageRequest.of(0, 10);

		when(employeeRepository.findAll(pageable)).thenReturn(new PageImpl<Employee>(employees));

		List<EmployeeDTO> employeesPage = employeeService.getAll();

		assertEquals(0, employeesPage);
	}

	@Test
	void saveEmployeeTest() {
		Employee employee = new Employee();
		employee.setName("Test");
		employee.setSurname("Test");

		employeeService.save(employee);
		employeeService.save(employee);

		verify(employeeRepository, times(2)).save(employee);
	}

	@Test
	void updateEmployeeTest() {
		Employee employee = new Employee();
		employee.setId(1);
		employee.setName("Test");
		employee.setSurname("Test");

		employeeService.save(employee);

		verify(employeeRepository, times(1)).save(employee);
	}

	@Test
	void deleteEmployeeTest() {
		Employee employee = new Employee();
		employee.setId(2);
		employee.setName("mitar");
		employee.setSurname("miric");
		employee.setActive(false);
		Department department = new Department();
		department.setId(1);
		department.setName("finansije");
		employee.setDepartment(department);

		when(employeeRepository.findById(employee.getId())).thenReturn(Optional.of(employee));
		employeeService.delete(employee.getId());

		verify(employeeRepository, times(1)).delete(employee);
	}

	@Test
	void getEmployeesByActiveTest() {
		List<Employee> employeesMock = new ArrayList<Employee>();
		Employee employee = new Employee();
		employee.setName("Test");
		employee.setSurname("Test");
		employee.setActive(true);
		employeesMock.add(employee);

		Employee employee1 = new Employee();
		employee1.setName("Rest");
		employee1.setSurname("Rest");
		employee1.setActive(false);
		employeesMock.add(employee1);

		Iterable<Employee> iterable = employeesMock;
		List<Employee> employeesList = StreamSupport
			    .stream(iterable.spliterator(), false)
			    .collect(Collectors.toList());

		when(employeeRepository.findAll()).thenReturn(employeesList);

		EmployeeSearchCriteria criteria = EmployeeSearchCriteria.builder().active(true).build();
		List<EmployeeDTO> employees = employeeService.search(criteria);
		assertEquals(1, employees.size());
	}
}
