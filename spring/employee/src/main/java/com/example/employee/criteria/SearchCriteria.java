package com.example.employee.criteria;

import org.springframework.data.jpa.domain.Specification;

public interface SearchCriteria<T> {
	Specification<T> toSpecification();
}
