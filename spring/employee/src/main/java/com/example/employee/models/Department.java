package com.example.employee.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.micrometer.common.lang.NonNull;
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
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "department", schema = "employee")
public class Department {
	
	@Id
	@Column(name = "department_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name = "name", length = 25)
	@NonNull
	@Size(min = 5, max = 25)
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

	public Date getAddDate() {
		return addDate;
	}

	public void setAddDate(Date addDate) {
		this.addDate = addDate;
	}

	public Date getModDate() {
		return modDate;
	}

	public void setModDate(Date modDate) {
		this.modDate = modDate;
	}

	public String getAddUser() {
		return addUser;
	}

	public void setAddUser(String addUser) {
		this.addUser = addUser;
	}

	public String getModUser() {
		return modUser;
	}

	public void setModUser(String modUser) {
		this.modUser = modUser;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
	
	public Set<Employee> getEmployees() {
		return employees;
	}

	public void setEmployees(Set<Employee> employees) {
		this.employees = employees;
	}

	public Set<Project> getProjects() {
		return projects;
	}

	public void setProjects(Set<Project> projects) {
		this.projects = projects;
	}

	@PrePersist
	private void beforeCreate() {
		this.active = true;
		this.addDate = new Date();
	}
	
	@PostUpdate
	private void beforeUpdate() {
		this.modDate = new Date();
	}

	@Override
	public String toString() {
		return "Department [id=" + id + ", name=" + name + ", addDate=" + addDate + ", modDate=" + modDate
				+ ", addUser=" + addUser + ", modUser=" + modUser + ", active=" + active + ", employees=" + employees
				+ "]";
	}
}
