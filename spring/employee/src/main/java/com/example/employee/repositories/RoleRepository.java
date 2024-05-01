package com.example.employee.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer>, PagingAndSortingRepository<Role, Integer> {

	@Query("SELECT r FROM Role as r inner join UserRole as ur on r.id = ur.role.id WHERE ur.user.id = :userId")
	List<Role> getRolesByUserId(Integer userId);
	
	List<Role> findRolesByUsersId(Integer userId);
}
