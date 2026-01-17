package com.example.employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer>, JpaSpecificationExecutor<Skill> {

//	@Query("SELECT s FROM Skill s WHERE s.name LIKE CONCAT('%', :name, '%')")
//	Slice<Skill> searchSkills(String name, Pageable pageable);
//
//	@Query("SELECT COUNT(s) FROM Skill s WHERE s.name LIKE CONCAT('%', :name, '%')")
//	Long searchResultCount(String name);

}
