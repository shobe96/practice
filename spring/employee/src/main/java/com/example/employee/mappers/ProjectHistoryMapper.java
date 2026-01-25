package com.example.employee.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.example.employee.models.ProjectHistory;
import com.example.employee.models.dtos.ProjectHistoryDTO;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {ProjectMapper.class, EmployeeMapper.class})
public interface ProjectHistoryMapper extends BaseMapper<ProjectHistory, ProjectHistoryDTO> {
	
	@Override
	@Mapping(source = "employee", target = "employee")
	@Mapping(source = "project", target = "project")
	ProjectHistoryDTO toDto(ProjectHistory entity);

}
