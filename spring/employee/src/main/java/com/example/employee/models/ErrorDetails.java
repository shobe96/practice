package com.example.employee.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorDetails {
	private String field;
    private String message;
    private boolean isForeignKey;
}
