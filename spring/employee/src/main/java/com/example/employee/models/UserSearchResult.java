package com.example.employee.models;

import java.util.List;

public class UserSearchResult {

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
