package com.example.employee.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.employee.criteria.SearchCriteria;
import com.example.employee.models.SearchResult;
import com.example.employee.services.BaseService;

public abstract class BaseServiceImpl <T, ID> implements BaseService<T, ID> {
	
	protected abstract JpaRepository<T, ID> getRepository();
    protected abstract JpaSpecificationExecutor<T> getSpecificationExecutor();

	@Override
	public List<T> getAll() {
		return getRepository().findAll();
	}

	@Override
	public T getById(ID id) {
		Optional<T> optional = getRepository().findById(id);
		if (optional.isPresent()) {
			return optional.get();
		} else {
			return null;
		}
	}

	@Override
	public T save(T entity) {
		return getRepository().save(entity);
	}

	@Override
	public void delete(ID id) {
		T entityToDelete = getById(id);
		deleteEntity(entityToDelete);
	}
	
	@Override
	public void deleteEntity(T entity) {
		getRepository().delete(entity);
	}

	@Override
	public <C extends SearchCriteria<T>> SearchResult<T> search(C criteria, Pageable pageable) {
		Specification<T> spec = criteria.toSpecification();
        Page<T> resultPage = getSpecificationExecutor().findAll(spec, pageable);
        return new SearchResult<>(resultPage.getContent(), resultPage.getTotalElements());
	}
	@Override
	public <C extends SearchCriteria<T>> List<T> search(C criteria) {
		Specification<T> spec = criteria.toSpecification();
		return getSpecificationExecutor().findAll(spec);
	}

}
