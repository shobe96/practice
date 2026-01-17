package com.example.employee.services.impl;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Service;

import com.example.employee.mappers.BaseMapper;
import com.example.employee.mappers.SkillMapper;
import com.example.employee.models.Skill;
import com.example.employee.models.dtos.SkillDTO;
import com.example.employee.repositories.SkillRepository;
import com.example.employee.services.SkillService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SkillServiceImpl extends BaseServiceImpl<Skill, SkillDTO,Integer> implements SkillService {
	
	private SkillRepository skillRepository;
	private SkillMapper skillMapper;
	
	public SkillServiceImpl(SkillRepository skillRepository, SkillMapper skillMapper) {
		super();
		this.skillRepository = skillRepository;
		this.skillMapper = skillMapper;
	}

	@Override
	protected JpaRepository<Skill, Integer> getRepository() {
		return skillRepository;
	}

	@Override
	protected JpaSpecificationExecutor<Skill> getSpecificationExecutor() {
		return skillRepository;
	}

	@Override
	protected BaseMapper<Skill, SkillDTO> getMapper() {
		return skillMapper;
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
