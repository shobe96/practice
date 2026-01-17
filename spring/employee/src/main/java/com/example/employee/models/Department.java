package com.example.employee.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "department")
@Getter
@Setter
@ToString
public class Department {

	@Id
	@Column(name = "department_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", length = 25)
	@NotBlank(message = "Name is mandatory")
	@Size(min = 5, max = 25, message = "Name size must be between 5 and 25")
	private String name;

	@Column(name = "add_date")
	private Date addDate;

	@Column(name = "mod_date")
	private Date modDate;

	@Column(name = "add_user")
	private String addUser;

	@Column(name = "mod_user")
	private String modUser;

	@Column(name = "active")
	private Boolean active;

	@OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<Employee> employees = new HashSet<>();

	@OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<Project> projects = new HashSet<>();

	@PrePersist
	private void beforeCreate() {
		this.active = true;
		this.addDate = new Date();
	}

	@PostUpdate
	private void beforeUpdate() {
		this.modDate = new Date();
	}
}
