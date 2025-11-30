package com.example.employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.employee.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
//	User findByUsername(String username);
//	User findByUsernameAndPassword(String username, String password);
//	
//	@Query("SELECT u FROM User u WHERE (u.username LIKE CONCAT('%', :username, '%') OR u.username IS NULL)")
//	public Page<User> searchUsers(String username, Pageable pageable);
//	
//	@Query("SELECT COUNT(u) FROM User u WHERE u.username LIKE CONCAT('%', :username, '%')")
//	public Long searchResultCount(String username);
}
