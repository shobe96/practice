package com.example.employee.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.employee.models.Project;
import com.example.employee.models.dtos.ProjectDTO;

@Mapper(componentModel = "spring")
public interface ProjectMapper extends BaseMapper<Project, ProjectDTO> {

	@Override
	@Mapping(source = "department.id", target = "departmentId")
	@Mapping(source = "skills", target = "skills")
	ProjectDTO toDto(Project entity);
	
	@Override
    @Mapping(source = "departmentId", target = "department.id")
    Project toEntity(ProjectDTO dto);
}
