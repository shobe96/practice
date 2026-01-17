package com.example.employee.models.dtos;

import java.util.Date;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectDTO {
	private Integer id;

	private String name;

	private String code;

	private Boolean active;

	private Date startDate;

	private Date endDate;

	private Integer departmentId;

	private Set<SkillDTO> skills;
}
