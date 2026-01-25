package com.example.employee.models.dtos;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectHistoryDTO {
	private Integer id;
	private Date endDate;
	private Date startDate;
	private EmployeeDTO employee;
	private ProjectDTO project;
}
