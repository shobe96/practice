package com.example.employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer>, JpaSpecificationExecutor<Role> {

//	@Query("SELECT r FROM Role as r inner join UserRole as ur ON r.id = ur.role.id WHERE ur.user.id = :userId")
//	List<Role> getRolesByUserId(Integer userId);
//	
//	List<Role> findRolesByUsersId(Integer userId);
//
//	@Query("SELECT r FROM Role r WHERE r.name LIKE CONCAT('%', :name, '%')")
//	Page<Role> searchRoles(String name, Pageable pageable);
//
//	@Query("SELECT COUNT(r) FROM Role r WHERE r.name LIKE CONCAT('%', :name, '%')")
//	Long searchResultCount(String name);
}
