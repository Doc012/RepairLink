package com.backend.Security.controllers;

import com.backend.Security.dtos.*;

import com.backend.Security.errors.UserAlreadyExistsException;
import com.backend.Security.errors.UserNotVerifiedException;
import com.backend.Security.services.AuthService;
import com.backend.Security.services.PasswordService;
import com.backend.Security.services.TokenBlacklistService;
import com.backend.User.entities.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;
    private final PasswordService passwordService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
//        {
//            "name": "Spha",
//            "surname": "Ngceps",
//            "phoneNumber": "0718171153",
//            "email": "221724818@edu.vut.ac.za",
//            "password": "1234567890",
//            "roleType": "ADMIN"
//        }
        try {
            CompletableFuture<Void> registrationFuture = authService.register(request);

            // Wait for registration to complete (with timeout)
            registrationFuture.get();

            return ResponseEntity.ok("Registration successful. Please check your email for verification.");
        } catch (UserAlreadyExistsException e) {
            log.warn("Registration attempt for existing user: {}", request.getEmail());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("User already registered");
        } catch (IllegalArgumentException e) {
            log.warn("Invalid registration request: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            log.error("Registration error", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            authService.verifyEmail(token);
            return ResponseEntity.ok("Email verified successfully");
        } catch (RuntimeException e) {
            log.warn("Email verification failed: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String jwt = authService.login(request);
            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (UserNotVerifiedException e) {
            log.warn("Login attempt for unverified user: {}", request.getEmail());
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Email not verified. Please check your inbox.");
        } catch (RuntimeException e) {
            log.warn("Login failed for email: {}", request.getEmail());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                tokenBlacklistService.blacklistToken(jwt);
                return ResponseEntity.ok("Logged out successfully");
            }
            return ResponseEntity.badRequest().body("Invalid token");
        } catch (Exception e) {
            log.error("Logout error", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Logout failed");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            passwordService.processForgotPassword(request.getEmail());
            return ResponseEntity.ok("Password reset link has been sent to your email");
        } catch (Exception e) {
            log.warn("Forgot password request failed: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error processing request: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully");
        } catch (Exception e) {
            log.warn("Password reset failed: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error resetting password: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails,
            @RequestBody ChangePasswordRequest request
    ) {
        try {
            User user = authService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            passwordService.changePassword(user, request.getCurrentPassword(), request.getNewPassword());

            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            log.warn("Password change failed: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error changing password: " + e.getMessage());
        }
    }
}