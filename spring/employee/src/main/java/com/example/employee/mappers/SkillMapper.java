package com.example.employee.mappers;

import org.mapstruct.Mapper;

import com.example.employee.models.Skill;
import com.example.employee.models.dtos.SkillDTO;

@Mapper(componentModel = "spring")
public interface SkillMapper extends BaseMapper<Skill, SkillDTO> {

}
