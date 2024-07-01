package com.example.employee.models;

import java.util.List;

public class SkillSearchResult {
	private List<Skill> skills;
	private Long size;

	public List<Skill> getSkills() {
		return skills;
	}

	public void setSkills(List<Skill> skills) {
		this.skills = skills;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}
}
