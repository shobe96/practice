package com.example.employee.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.example.employee.models.Project;
import com.example.employee.models.dtos.ProjectDTO;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {SkillMapper.class, EmployeeMapper.class, DepartmentMapper.class})
public interface ProjectMapper extends BaseMapper<Project, ProjectDTO> {

	@Override
	@Mapping(source = "department", target = "department")
	@Mapping(source = "skills", target = "skills")
	@Mapping(source = "employees", target = "employees")
	ProjectDTO toDto(Project entity);
}
