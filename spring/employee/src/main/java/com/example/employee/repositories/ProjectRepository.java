package com.example.employee.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Project;

@Repository
public interface ProjectRepository
		extends CrudRepository<Project, Integer>, PagingAndSortingRepository<Project, Integer> {
	
	@Query("SELECT p FROM Project p WHERE p.name LIKE CONCAT('%', :name, '%')")
	Slice<Project> searchProjects(String name, Pageable pageable);

	@Query("SELECT COUNT(p) FROM Project p WHERE p.name LIKE CONCAT('%', :name, '%')")
	Long searchResultCount(String name);
}
