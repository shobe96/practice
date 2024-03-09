package com.example.employee.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.example.employee.models.Department;
import com.example.employee.models.Employee;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.services.impl.EmployeeServiceImpl;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceUnitTest {
	
	@InjectMocks
	private EmployeeServiceImpl employeeService;
	
	@Mock
	private EmployeeRepository employeeRepository;
	
	@Test
	public void getAllEmployeesTest() {
		List<Employee> employees = new ArrayList<Employee>();
		Employee employee = new Employee();
		employee.setName("Test");
		employee.setSurname("Test");
		employees.add(employee);
		
		Pageable pageable = PageRequest.of(0, 10);

		when(employeeRepository.findAll(pageable)).thenReturn(new PageImpl<Employee>(employees));
		
		Page<Employee> employeesPage = employeeService.getAllEmployees(pageable);
		
		assertEquals(1, employeesPage.getSize());
	}
	
	@Test
	public void saveEmployeeTest() {
		Employee employee = new Employee();
		employee.setName("Test");
		employee.setSurname("Test");
		
		employeeService.saveEmployee(employee);
		employeeService.saveEmployee(employee);
		
		verify(employeeRepository, times(2)).save(employee);
	}
	
	@Test
	public void updateEmployeeTest() {
		Employee employee = new Employee();
		employee.setId(1);
		employee.setName("Test");
		employee.setSurname("Test");
		
		employeeService.updateEmployee(employee);
		
		verify(employeeRepository, times(1)).save(employee);
	}
	
	@Test
	public void deleteEmployeeTest() {
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
		employeeService.deleteEmployee(employee.getId());
		
		verify(employeeRepository, times(1)).delete(employee);
	}
	
	@Test
	public void getEmployeesByActiveTest() {
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

		when(employeeRepository.findAll()).thenReturn(iterable);
		
		List<Employee> employees = employeeService.filterByActive(true);
		assertEquals(1, employees.size());
	}
	
//	@Test
//	public void getEmployee2Test() throws Exception {
//		
//		Integer testInt = anyInt();
//		
//		Exception exception = assertThrows(Exception.class, () -> {
//			employeeService.getEmployeebyId2(testInt);
//        });
//		
//		assertEquals("Employee not found for id: " + testInt, exception.getMessage());
//		
//	}
}
