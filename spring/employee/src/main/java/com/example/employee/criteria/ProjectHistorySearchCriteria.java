package com.example.employee.criteria;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.example.employee.models.ProjectHistory;

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
public class ProjectHistorySearchCriteria  implements SearchCriteria<ProjectHistory>{
	
	private Integer employeeId;
	
	@Override
	public Specification<ProjectHistory> toSpecification() {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();


			if (employeeId != null) {
				predicates.add(root.join("employee").get("id").in(employeeId));
			}

			query.distinct(true);
			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}

}
