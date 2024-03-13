package com.example.employee.models;

import java.util.Date;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "employee", schema = "employee")
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
	
	@ManyToOne
	@JoinColumn(name = "department_id")
	@JsonIgnoreProperties("employees")
	Department department;

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

	@Override
	public String toString() {
		return "Employee [id=" + id + ", name=" + name + ", surname=" + surname + ", addDate=" + addDate + ", modDate="
				+ modDate + ", addUser=" + addUser + ", modUser=" + modUser + ", active=" + active + ", department="
				+ department + "]";
	}
}
