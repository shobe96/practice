package com.example.employee.criteria;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.example.employee.models.Employee;
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
public class EmployeeSearchCriteria implements SearchCriteria<Employee> {
	
	private String name;
    private String surname;
    private String email;
    private Integer departmentId;
    private Integer userId;
    private Boolean active;
    private List<Integer> skillIds;
    private Boolean withoutUser;

	@Override
	public Specification<Employee> toSpecification() {
		return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            if (surname != null && !surname.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("surname")), "%" + surname.toLowerCase() + "%"));
            }
            if (email != null && !email.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
            }
            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }
            if (userId != null) {
            	predicates.add(cb.equal(root.get("user").get("id"), userId));
            }
            if (active != null) {
            	predicates.add(cb.equal(root.get("active"), active));
            }
            if (skillIds != null && !skillIds.isEmpty()) {
                predicates.add(root.joinSet("skills").get("id").in(skillIds));
                query.distinct(true);
            }
            if (Boolean.TRUE.equals(withoutUser)) {
                predicates.add(cb.isNull(root.get("user")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
	}

}
