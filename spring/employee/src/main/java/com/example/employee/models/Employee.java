package com.example.employee.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "employee")
@Getter
@Setter
@ToString
public class Employee {

	@Id
	@Column(name = "employee_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", length = 25)
	@NotBlank(message = "Name is mandatory")
	@Size(min = 5, max = 25, message = "Name size must be between 5 and 25")
	private String name;

	@Column(name = "surname", length = 25)
	@NotBlank(message = "Surname is mandatory")
	@Size(min = 5, max = 25, message = "Surname size must be between 5 and 25")
	private String surname;

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

	@Column(name = "email", length = 50)
	@Email(message = "Email is not in correct format")
	@Size(max = 50, message = "Email can't be longer than 50 characters")
	@NotBlank(message = "Email is mandatory")
	private String email;
	
	@Column(name = "assignment_date")
	private Date assignmentDate;

	@ManyToOne()
	@JoinColumn(name = "department_id")
	@JsonIgnoreProperties("employees")
	private Department department;

	@OneToOne()
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "employee_skill", joinColumns = @JoinColumn(name = "employee_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
	private Set<Skill> skills = new HashSet<>();

	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "employees")
	@JsonIgnore
	private Set<Project> projects = new HashSet<>();
	
	@OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
	@JsonIgnore
	private Set<ProjectHistory> projectHistories = new HashSet<>();

	@PrePersist
	private void beforeCreate() {
		this.active = false;
		this.addDate = new Date();
	}

	@PostUpdate
	private void beforeUpdate() {
		this.modDate = new Date();
	}
}
