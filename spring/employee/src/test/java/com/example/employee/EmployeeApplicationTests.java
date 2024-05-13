package com.example.employee;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.employee.services.EmployeeService;

@SpringBootTest
class EmployeeApplicationTests {
	
	private EmployeeService employeeService;
	
	
	@Autowired
	public EmployeeApplicationTests(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}



	@Test
	void contextLoads() {
		assertThat(employeeService).isNotNull();
	}

}
