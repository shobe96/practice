package com.example.employee.services;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.Skill;
import com.example.employee.utils.SearchResult;

public interface SkillService {
	public SearchResult<Skill> getAllSkills(Pageable pageable);
	public SearchResult<Skill> getAllSkills();
	public Skill getSkillbyId(Integer skillId); 
	public Skill saveSkill(Skill skill);
	public Skill updateSkill(Skill skill);
	public void deleteSkill(Integer skillId);
	public SearchResult<Skill> searcSkills(String name, Pageable pageable);
}
