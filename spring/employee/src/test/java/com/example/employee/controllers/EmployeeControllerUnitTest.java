package com.example.employee.controllers;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

import com.example.employee.models.Employee;
import com.example.employee.services.EmployeeService;

@ExtendWith(MockitoExtension.class)
public class EmployeeControllerUnitTest {
	
	
	@InjectMocks
	EmployeeController employeeController; 

	@Mock
	EmployeeService employeeService;

	@Autowired
	private MockMvc mockMvc;
	
	 @Captor
	 private ArgumentCaptor<String> stringArgumentCaptor;


	@Test
	public void getAllEmployeesTest() {
		List<Employee> employees = new ArrayList<Employee>();
		Employee employee = new Employee();
		employee.setName("Test");
		employee.setSurname("Test");
		employees.add(employee);
		
		Pageable pageable = PageRequest.of(0, 10);
		when(employeeService.getAllEmployees(pageable)).thenReturn(new PageImpl<Employee>(employees));
		
		try {
			MvcResult mvcResult = this.mockMvc.perform(get("/api/employees")).andExpect(status().isOk()).andReturn();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		};
	}
}
