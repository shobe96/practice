package com.example.employee.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.Table;

@Entity
@Table(name = "employee", schema = "employee")
public class Employee {

	@Id
	@Column(name = "employee_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer employeeId;
	
	@Column(name = "name", length = 25)
	private String name;
	
	@Column(name = "surname", length = 25)
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
	
	@ManyToOne
	@JoinColumn(name = "department_id")
	Department department;

	public Integer getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Integer employeeId) {
		this.employeeId = employeeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
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
	
	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
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
