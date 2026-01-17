package com.example.employee.models;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "skill")
@Getter
@Setter
@ToString
public class Skill {
	@Id
	@Column(name = "skill_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", length = 25)
	@NotBlank(message = "Name is mandatory")
	@Size(min = 1, max = 25, message = "Name size must be between 1 and 25")
	private String name;

	@Column(name = "description", length = 100)
	@Size(min = 5, max = 100, message = "Description size must be between 5 and 100")
	private String description;

	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "skills")
	@JsonIgnore
	private Set<Employee> employees;
	
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "skills")
	@JsonIgnore
	private Set<Project> projects;
}
