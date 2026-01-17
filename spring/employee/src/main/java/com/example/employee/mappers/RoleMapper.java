package com.example.employee.mappers;

import org.mapstruct.Mapper;

import com.example.employee.models.Role;
import com.example.employee.models.dtos.RoleDTO;

@Mapper(componentModel = "spring")
public interface RoleMapper extends BaseMapper<Role, RoleDTO> {

}
