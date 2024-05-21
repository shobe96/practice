package com.example.employee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.employee.models.Skill;
import com.example.employee.models.SkillSearchResult;
import com.example.employee.repositories.SkillRepository;
import com.example.employee.services.SkillService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SkillServiceImpl implements SkillService {
	
	private SkillRepository skillRepository;

	@Autowired
	public SkillServiceImpl(SkillRepository skillRepository) {
		this.skillRepository = skillRepository;
	}

	@Override
	public SkillSearchResult getAllSkills(Pageable pageable) {
		SkillSearchResult skillSearchResult = new SkillSearchResult();
		List<Skill> skills = skillRepository.findAll(pageable).getContent();
		if (skills.size() == 0) {
			Pageable newPage = PageRequest.of((pageable.getPageNumber() - 1), pageable.getPageSize());
			skills = skillRepository.findAll(newPage).getContent();
		}
		skillSearchResult.setSize(skillRepository.count());
		skillSearchResult.setSkills(skills);
		return skillSearchResult;
	}

	@Override
	public SkillSearchResult getAllSkills() {
		List<Skill> skills = new ArrayList<>();
		skillRepository.findAll().forEach(skills::add);
		SkillSearchResult skillSearchResult = new SkillSearchResult();
		skillSearchResult.setSkills(skills);		
		return skillSearchResult;
	}

	@Override
	public Skill getSkillbyId(Integer skillId) {
		Optional<Skill> optional = skillRepository.findById(skillId);
		if (optional.isPresent()) {
			return optional.get();
		} else {
			return null;
		}
	}

	@Override
	public Skill saveSkill(Skill skill) {
		return skillRepository.save(skill);
	}

	@Override
	public Skill updateSkill(Skill skill) {
		return skillRepository.save(skill);
	}

	@Override
	public void deleteSkill(Integer skillId) {
		Skill skill = getSkillbyId(skillId);
		skillRepository.delete(skill);
	}

	@Override
	public SkillSearchResult searcSkills(String name, Pageable pageable) {
		if (name == null) {
			name = "";
		}
		SkillSearchResult skillSearchResult = new SkillSearchResult();
		List<Skill> employees = skillRepository.searchSkills(name, pageable).getContent();
		skillSearchResult.setSkills(employees);
		skillSearchResult.setSize(skillRepository.searchResultCount(name));
		return skillSearchResult;
	}
}
