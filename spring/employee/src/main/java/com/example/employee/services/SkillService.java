package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.SearchResult;
import com.example.employee.models.Skill;

public interface SkillService {
	public SearchResult<Skill> getAllSkills(Pageable pageable);
	public List<Skill> getAllSkills();
	public Skill getSkillbyId(Integer skillId); 
	public Skill saveSkill(Skill skill);
	public Skill updateSkill(Skill skill);
	public void deleteSkill(Integer skillId);
	public SearchResult<Skill> searcSkills(String name, Pageable pageable);
}
