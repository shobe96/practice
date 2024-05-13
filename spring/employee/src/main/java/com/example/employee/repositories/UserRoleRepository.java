package com.example.employee.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.UserRole;

@Repository
public interface UserRoleRepository
		extends CrudRepository<UserRole, Integer>, PagingAndSortingRepository<UserRole, Integer> {

}
