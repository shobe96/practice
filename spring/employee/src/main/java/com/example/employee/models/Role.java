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

@Entity
@Table(name = "role", schema = "employee")
public class Role {

	@Id
	@Column(name = "role_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "code")
	@NotBlank(message = "Code is mandatory")
	@Size(min = 3, max = 5)
	private String code;

	@Column(name = "name", length = 25)
	@NotBlank(message = "Name is mandatory")
	@Size(min = 5, max = 25, message = "Name size must be between 5 and 25")
	private String name;

	@Column(name = "description", length = 100)
	@NotBlank(message = "Description is mandatory")
	@Size(min = 5, max = 100, message = "Description size must be between 5 and 100")
	private String description;
	
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "roles")
	@JsonIgnore
	private Set<User> users;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}
}
