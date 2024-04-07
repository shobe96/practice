package com.example.employee.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.models.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer>, PagingAndSortingRepository<Role, Integer> {

}
