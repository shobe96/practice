package com.example.employee.models;

import java.util.List;

public class SearchResult<T> {

	private List<T> items;
	private Long size;
	
	public List<T> getItems() {
		return items;
	}
	public void setItems(List<T> items) {
		this.items = items;
	}
	public Long getSize() {
		return size;
	}
	public void setSize(Long size) {
		this.size = size;
	}
}
