package com.example.employee.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.employee.criteria.SearchCriteria;
import com.example.employee.mappers.BaseMapper;
import com.example.employee.models.SearchResult;
import com.example.employee.services.BaseService;

public abstract class BaseServiceImpl<T, D, ID> implements BaseService<T, D, ID> {

	protected abstract JpaRepository<T, ID> getRepository();

	protected abstract JpaSpecificationExecutor<T> getSpecificationExecutor();

	protected abstract BaseMapper<T, D> getMapper();

	@Override
	@Cacheable(cacheResolver = "entityCacheResolver")
	public List<D> getAll() {
		List<T> entities = getRepository().findAll();
		return getMapper().toDtoList(entities);
	}

	@Override
	public D getById(ID id) {
		return getEntityById(id).map(getMapper()::toDto).orElse(null);
	}

	@Override
	@CacheEvict(allEntries = true, cacheResolver = "entityCacheResolver")
	public D save(T entity) {
		T savedEntity = getRepository().save(entity);
		return getMapper().toDto(savedEntity);
	}

	@Override
	@CacheEvict(allEntries = true, cacheResolver = "entityCacheResolver")
	public void delete(ID id) {
		T entityToDelete = getEntityById(id).get();
		deleteEntity(entityToDelete);
	}

	@Override
	@CacheEvict(allEntries = true, cacheResolver = "entityCacheResolver")
	public void deleteEntity(T entity) {
		getRepository().delete(entity);
	}

	@Override
	public <C extends SearchCriteria<T>> SearchResult<D> search(C criteria, Pageable pageable) {
		Specification<T> spec = criteria.toSpecification();
		Page<T> resultPage = getSpecificationExecutor().findAll(spec, pageable);
		List<D> dtoList = getMapper().toDtoList(resultPage.getContent());
		return new SearchResult<>(dtoList, resultPage.getTotalElements());
	}

	@Override
	public <C extends SearchCriteria<T>> List<D> search(C criteria) {
		Specification<T> spec = criteria.toSpecification();
		List<T> list = getSpecificationExecutor().findAll(spec);
		return getMapper().toDtoList(list);
	}

	public Optional<T> getEntityById(ID id) {
		return getRepository().findById(id);
	}
	
	@Override
	public <C extends SearchCriteria<T>> List<T> searchEntities(C criteria) {
	    Specification<T> spec = criteria.toSpecification();
	    return getSpecificationExecutor().findAll(spec);
	}

}
