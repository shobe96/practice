package com.example.employee.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.employee.models.User;
import com.example.employee.models.dtos.UserDTO;

@Mapper(componentModel = "spring")
public interface UserMapper extends BaseMapper<User, UserDTO>{
	
	@Override
	@Mapping(source = "roles", target = "roles")
	UserDTO toDto(User entity);

}
