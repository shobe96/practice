package com.example.employee.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.User;

@Repository
public interface UserRepository extends CrudRepository<User, Integer>, PagingAndSortingRepository<User, Integer> {
	User findByUsername(String username);
	User findByUsernameAndPassword(String username, String password);
}
