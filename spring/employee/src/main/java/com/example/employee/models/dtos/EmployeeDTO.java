package com.example.employee.models.dtos;

import java.util.Date;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeDTO {
	private Integer id;
    private String name;
    private String surname;
    private String email;
    private Boolean active;
    private Date assignmentDate;
    private Date addDate;
    private DepartmentDTO department;
    private UserDTO user;
    private Set<SkillDTO> skills;
}
