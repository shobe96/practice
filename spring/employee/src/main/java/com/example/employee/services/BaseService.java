package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.SearchResult;

import com.example.employee.criteria.SearchCriteria;

public interface BaseService<T, ID> {
	public List<T> getAll();
	public T getById(ID id);
	public T save(T entity);
	public void delete(ID id);
	public void deleteEntity(T entity);
	public <C extends SearchCriteria<T>> SearchResult<T> search(C criteria, Pageable pageable);
	public <C extends SearchCriteria<T>> List<T> search(C criteria);
}
