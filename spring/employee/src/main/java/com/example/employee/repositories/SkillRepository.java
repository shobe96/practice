package com.example.employee.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Skill;

@Repository
public interface SkillRepository extends CrudRepository<Skill, Integer>, PagingAndSortingRepository<Skill, Integer> {

	@Query("SELECT s FROM Skill s WHERE s.name LIKE CONCAT('%', :name, '%')")
	Slice<Skill> searchSkills(String name, Pageable pageable);

	@Query("SELECT COUNT(s) FROM Skill s WHERE s.name LIKE CONCAT('%', :name, '%')")
	Long searchResultCount(String name);

}
