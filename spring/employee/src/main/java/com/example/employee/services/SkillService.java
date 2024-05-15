package com.example.employee.services;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.Skill;
import com.example.employee.models.SkillSearchResult;

public interface SkillService {
	public SkillSearchResult getAllSkills(Pageable pageable);
	public SkillSearchResult getAllSkills();
	public Skill getSkillbyId(Integer skillId); 
	public Skill saveSkill(Skill skill);
	public Skill updateSkill(Skill skill);
	public void deleteSkill(Integer skillId);
	public SkillSearchResult searcSkills(String name, Pageable pageable);
}
