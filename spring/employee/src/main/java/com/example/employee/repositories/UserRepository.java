package com.example.employee.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.User;

@Repository
public interface UserRepository extends CrudRepository<User, Integer>, PagingAndSortingRepository<User, Integer> {
	User findByUsername(String username);
	User findByUsernameAndPassword(String username, String password);
	
	@Query("SELECT u FROM User u WHERE (u.username LIKE CONCAT('%', :username, '%') OR u.username IS NULL)")
	public Page<User> searchUsers(String username, Pageable pageable);
	
	@Query("SELECT COUNT(u) FROM User u WHERE u.username LIKE CONCAT('%', :username, '%')")
	public Long searchResultCount(String username);
}
