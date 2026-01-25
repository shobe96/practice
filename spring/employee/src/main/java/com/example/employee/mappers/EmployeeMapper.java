package com.example.employee.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.example.employee.models.Employee;
import com.example.employee.models.dtos.EmployeeDTO;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {SkillMapper.class, DepartmentMapper.class, UserMapper.class})
public interface EmployeeMapper extends BaseMapper<Employee, EmployeeDTO> {
	
	@Override
	@Mapping(source = "department", target = "department")
	@Mapping(source = "user", target = "user")
	@Mapping(source = "skills", target = "skills")
	EmployeeDTO toDto(Employee entity);
}
