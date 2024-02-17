package com.example.employee.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.Table;


@Entity
@Table(name = "department", schema = "employee")
public class Department {
	
	@Id
	@Column(name = "department_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer departmentId;
	
	@Column(name = "name", length = 25)
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
	Set<Employee> employees = new HashSet<Employee>();

	public Integer getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Integer departmentId) {
		this.departmentId = departmentId;
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
