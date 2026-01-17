package com.example.employee.services;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.example.employee.models.SearchResult;

import com.example.employee.criteria.SearchCriteria;

public interface BaseService<T, D, ID> {
	public List<D> getAll();
	public D getById(ID id);
	public D save(T entity);
	public void delete(ID id);
	public void deleteEntity(T entity);
	public <C extends SearchCriteria<T>> SearchResult<D> search(C criteria, Pageable pageable);
	public <C extends SearchCriteria<T>> List<D> search(C criteria);
	public <C extends SearchCriteria<T>> List<T> searchEntities(C criteria);
}
