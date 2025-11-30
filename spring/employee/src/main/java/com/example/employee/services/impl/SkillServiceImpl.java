package com.example.employee.services.impl;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Service;

import com.example.employee.models.Skill;
import com.example.employee.repositories.SkillRepository;
import com.example.employee.services.SkillService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SkillServiceImpl extends BaseServiceImpl<Skill, Integer> implements SkillService {
	
	private SkillRepository skillRepository;
	
	@Override
	protected JpaRepository<Skill, Integer> getRepository() {
		return skillRepository;
	}

	@Override
	protected JpaSpecificationExecutor<Skill> getSpecificationExecutor() {
		return skillRepository;
	}

	public SkillServiceImpl(SkillRepository skillRepository) {
		this.skillRepository = skillRepository;
	}

//	@Override
//	public SearchResult<Skill> getAllSkills(Pageable pageable) {
//		SearchResult<Skill> skillSearchResult = new SearchResult<>();
//		List<Skill> skills = skillRepository.findAll(pageable).getContent();
//		if (skills.isEmpty()) {
//			Pageable newPage = PageRequest.of((pageable.getPageNumber() - 1), pageable.getPageSize());
//			skills = skillRepository.findAll(newPage).getContent();
//		}
//		skillSearchResult.setSize(skillRepository.count());
//		skillSearchResult.setItems(skills);
//		return skillSearchResult;
//	}
//
//	@Override
//	public List<Skill> getAllSkills() {
//		List<Skill> skills = new ArrayList<>();
//		skillRepository.findAll().forEach(skills::add);	
//		return skills;
//	}
//
//	@Override
//	public Skill getSkillbyId(Integer skillId) {
//		Optional<Skill> optional = skillRepository.findById(skillId);
//		if (optional.isPresent()) {
//			return optional.get();
//		} else {
//			return null;
//		}
//	}
//
//	@Override
//	public Skill saveSkill(Skill skill) {
//		return skillRepository.save(skill);
//	}
//
//	@Override
//	public Skill updateSkill(Skill skill) {
//		return skillRepository.save(skill);
//	}
//
//	@Override
//	public void deleteSkill(Integer skillId) {
//		Skill skill = getSkillbyId(skillId);
//		skillRepository.delete(skill);
//	}
//
//	@Override
//	public SearchResult<Skill> searcSkills(String name, Pageable pageable) {
//		if (name == null) {
//			name = "";
//		}
//		SearchResult<Skill> skillSearchResult = new SearchResult<>();
//		List<Skill> employees = skillRepository.searchSkills(name, pageable).getContent();
//		skillSearchResult.setItems(employees);
//		skillSearchResult.setSize(skillRepository.searchResultCount(name));
//		return skillSearchResult;
//	}

	
}
