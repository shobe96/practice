package com.example.employee.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "project", schema = "employee")
public class Project {
	@Id
	@Column(name = "project_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", length = 25)
	@NotBlank(message = "Name is mandatory")
	@Size(min = 5, max = 25, message = "Name size must be between 5 and 25")
	private String name;

	@Column(name = "code", length = 5)
	@NotBlank(message = "Code is mandatory")
	@Size(min = 3, max = 5, message = "Code size must be between 3 and 5")
	private String code;

	@Column(name = "active")
	private Boolean active;

	@Column(name = "start_date")
	@NotNull(message = "Start date is mandatory")
	private Date startDate;

	@Column(name = "end_date")
	@NotNull(message = "End date is mandatory")
	private Date endDate;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "employee_project", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "employee_id"))
	private Set<Employee> employees;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "project_skill", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
	private Set<Skill> skills = new HashSet<>();

	@ManyToOne()
	@JoinColumn(name = "department_id")
	@JsonIgnoreProperties("projects")
	private Department department;

	@OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<ProjectHistory> projectHistories = new HashSet<>();

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Set<Employee> getEmployees() {
		return employees;
	}

	public void setEmployees(Set<Employee> employees) {
		this.employees = employees;
	}

	public Set<Skill> getSkills() {
		return skills;
	}

	public void setSkills(Set<Skill> skills) {
		this.skills = skills;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public Set<ProjectHistory> getProjectHistories() {
		return projectHistories;
	}

	public void setProjectHistories(Set<ProjectHistory> projectHistories) {
		this.projectHistories = projectHistories;
	}

	@PrePersist
	private void beforeCreate() {
		this.active = true;
	}

	@Override
	public String toString() {
		return "Project [id=" + id + ", name=" + name + ", code=" + code + ", active=" + active + ", startDate="
				+ startDate + ", endDate=" + endDate + ", employees=" + employees + ", skills=" + skills
				+ ", department=" + department + ", projectHistories=" + projectHistories + "]";
	}
}
