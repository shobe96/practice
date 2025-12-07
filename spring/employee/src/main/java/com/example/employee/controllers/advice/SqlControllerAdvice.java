package com.example.employee.controllers.advice;

import java.sql.SQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.example.employee.models.ApiError;
import com.example.employee.models.ErrorDetails;

@ControllerAdvice
public class SqlControllerAdvice {

	@ResponseStatus(HttpStatus.CONFLICT)
	@ExceptionHandler(SQLException.class)
	public ResponseEntity<ApiError> handleValidationExceptions(SQLException ex) {
		// --- Get Details from the Exception Chain (SQLException) ---
        // We only use the first exception in the chain for simplicity
        Throwable rootCause = ex.getCause() != null ? ex.getCause() : ex;

        // Extract field and message using the helper
        ErrorDetails details = extractSqlErrorDetails(rootCause.getMessage());
        
        // --- Create the ApiError Response ---
        HttpStatus status = HttpStatus.BAD_REQUEST; // Default to 400
        
        // If it's a Foreign Key error, we generally prefer 409 Conflict
        if (details.isForeignKey()) {
            status = HttpStatus.CONFLICT;
        }

        // Use the ApiError class constructor/setter
        ApiError error = new ApiError(
            status.value(), 
            details.isForeignKey() ? "DATA_INTEGRITY_CONFLICT" : "SQL_VALIDATION_ERROR",
            details.getMessage(), 
            details.getField()
        );
        
        // Log the full exception message for debugging
        System.err.println("SQL Exception details: " + ex.getMessage());

        return new ResponseEntity<>(error, status);
	}
	
	private ErrorDetails extractSqlErrorDetails(String fullMessage) {
        String field = "unknown";
        String message = "Database constraint violation occurred.";
        boolean isForeignKey = false;

        // 1. Safely Extract the Field Name (using the quote-finding logic)
        int firstQuote = fullMessage.indexOf("'");
        
        if (firstQuote != -1) {
            String temp = fullMessage.substring(firstQuote + 1);
            int secondQuote = temp.indexOf("'");
            
            // Only use the field if the parsing is successful
            if (secondQuote != -1) { 
                field = temp.substring(0, secondQuote);
            }
        }
        
        // 2. Determine User-Friendly Message and Error Type
        String lowerMessage = fullMessage.toLowerCase();
        
        if (lowerMessage.contains("long") || lowerMessage.contains("data too long")) {
            message = "Field exceeds maximum allowed length.";
        } else if (lowerMessage.contains("null") || lowerMessage.contains("cannot be null")) {
            message = "Field is mandatory (cannot be null).";
        } else if (lowerMessage.contains("foreign key") || lowerMessage.contains("parent row")) {
             message = "Cannot delete or update record because other data relies on it.";
             field = "data_integrity"; // Use a general field for non-field-specific errors
             isForeignKey = true;
        } else if (lowerMessage.contains("duplicate entry")) {
            message = "A record with this value already exists (must be unique).";
            // For unique constraints, 'field' often contains the key name, which is fine
        }

        return new ErrorDetails(field, message, isForeignKey);
    }
}
