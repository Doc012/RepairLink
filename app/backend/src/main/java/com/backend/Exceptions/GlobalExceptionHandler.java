package com.backend.Exceptions;

import com.backend.Exceptions.security.UserAlreadyExistsException;
import com.backend.Exceptions.services.UnverifiedProviderException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle UserAlreadyExistsException
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "An account with this email already exists. Please sign in or use another email address.");
        errorResponse.put("status", "error");

        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // Handle UnverifiedProviderException
    @ExceptionHandler(UnverifiedProviderException.class)
    public ResponseEntity<String> handleUnverifiedProviderException(UnverifiedProviderException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }
}
