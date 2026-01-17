package com.example.employee.criteria;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.example.employee.models.Project;
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
public class ProjectSearchCriteria implements SearchCriteria<Project> {
	private String name;
	private String code;
	private Integer employeeId;
	private Integer phEmployeeId;
	private Boolean active;

	@Override
	public Specification<Project> toSpecification() {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (name != null && !name.isBlank()) {
				predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
			}
			if (code != null && !code.isBlank()) {
				predicates.add(cb.like(cb.lower(root.get("code")), "%" + code.toLowerCase() + "%"));
			}
			if (active != null) {
				 predicates.add(cb.equal(root.get("active"), active));
			}
			if (employeeId != null) {
				predicates.add(root.join("employees").get("id").in(employeeId));
			}

			if (phEmployeeId != null) {
				predicates.add(root.join("projectHistories").join("employee").get("id").in(employeeId));
			}

			query.distinct(true);
			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}
}
