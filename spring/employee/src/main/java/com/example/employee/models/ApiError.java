package com.example.employee.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiError {
	// HTTP Status code (e.g., 409)
    private int status;
    
    // A short, unique error code (e.g., FK_VIOLATION)
    private String errorCode; 
    
    // A readable message for the client/user
    private String message;
    
    // Optional: The specific field causing the issue (e.g., departmentId)
    private String field; 
}
