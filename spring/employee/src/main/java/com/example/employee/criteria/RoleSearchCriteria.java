package com.example.employee.criteria;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.example.employee.models.Role;

import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleSearchCriteria implements SearchCriteria<Role>{
	private String name;
	
	private Integer userId;

	@Override
	public Specification<Role> toSpecification() {
		return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            
            if (userId != null) {
            	predicates.add(root.join("users").get("id").in(userId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
	}
}
