package com.example.employee.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserSearchResult {

	@JsonProperty("items")
	private List<User> users;
	private Long size;

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

}
