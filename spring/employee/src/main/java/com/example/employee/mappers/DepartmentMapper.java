package com.example.employee.mappers;

import org.mapstruct.Mapper;

import com.example.employee.models.Department;
import com.example.employee.models.dtos.DepartmentDTO;

@Mapper(componentModel = "spring")
public interface DepartmentMapper extends BaseMapper<Department, DepartmentDTO> {

}
