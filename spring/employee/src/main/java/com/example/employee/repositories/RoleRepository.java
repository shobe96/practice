package com.example.employee.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer>, PagingAndSortingRepository<Role, Integer> {

	@Query("SELECT r FROM Role as r inner join UserRole as ur ON r.id = ur.role.id WHERE ur.user.id = :userId")
	List<Role> getRolesByUserId(Integer userId);
	
	List<Role> findRolesByUsersId(Integer userId);

	@Query("SELECT r FROM Role r WHERE r.name LIKE CONCAT('%', :name, '%')")
	Page<Role> searchRoles(String name, Pageable pageable);

	@Query("SELECT COUNT(r) FROM Role r WHERE r.name LIKE CONCAT('%', :name, '%')")
	Long searchResultCount(String name);
}
