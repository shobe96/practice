package com.example.employee.models;

public class RestError {
    private Integer status;
    private String statusText;
    private Boolean ok;
    private String name;
    private String message;
    
	public RestError(Integer status, String statusText, Boolean ok, String name, String message) {
		this.status = status;
		this.statusText = statusText;
		this.ok = ok;
		this.name = name;
		this.message = message;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getStatusText() {
		return statusText;
	}

	public void setStatusText(String statusText) {
		this.statusText = statusText;
	}

	public Boolean getOk() {
		return ok;
	}

	public void setOk(Boolean ok) {
		this.ok = ok;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	
}
