package com.backend.Security.services;

import com.backend.Features.Customer.entity.Customer;
import com.backend.Features.Customer.repository.CustomerRepository;
import com.backend.Security.dtos.LoginRequest;
import com.backend.Security.dtos.RegisterRequest;

import com.backend.Security.errors.UserAlreadyExistsException;
import com.backend.Security.errors.UserNotVerifiedException;
import com.backend.User.entities.RoleType;
import com.backend.User.entities.User;
import com.backend.User.repositories.RoleRepository;
import com.backend.User.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final CustomerRepository customerRepository;


    @Value("${app.verification.token.expiration-minutes:5}")
    private long verificationTokenExpirationMinutes;

    @Value("${app.verification.max-attempts:3}")
    private int maxVerificationAttempts;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    // Enhanced registration with more robust checks and async email sending
    public CompletableFuture<Void> register(RegisterRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            validateRegistrationRequest(request);
            Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

            if (existingUser.isPresent()) {
                return handleExistingUser(existingUser.get(), request);
            }

            User newUser = createNewUser(request);

            if (request.getRoleType().equals("CUSTOMER")) {
                createCustomer(newUser);
            }

            return newUser;
        }).thenAcceptAsync(user -> {
            if (user != null) {
                sendVerificationEmail(user);
            }
        }).exceptionally(ex -> {
            throw new RuntimeException(ex);
        });
    }

    private void createCustomer(User user) {
        Customer customer = new Customer();
        customer.setUser(user);
        customerRepository.save(customer);
    }

    // Validate registration request
    private void validateRegistrationRequest(RegisterRequest request) {
        // Add more sophisticated validation
        if (request.getEmail() == null || !isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

    }

    // Handle existing user logic
    private User handleExistingUser(User existingUser, RegisterRequest request) {
        // If user is already verified
        if (existingUser.isEnabled()) {
            throw new UserAlreadyExistsException("User already registered");
        }

        // Increment verification attempts
        int attempts = existingUser.getVerificationAttempts() + 1;
        if (attempts > maxVerificationAttempts) {
            userRepository.delete(existingUser);
            throw new RuntimeException("Maximum verification attempts exceeded. Please register again.");
        }

        // Update user details and regenerate token
        existingUser.setName(request.getName());
        existingUser.setSurname(request.getSurname());
        existingUser.setPhoneNumber(request.getPhoneNumber());
        existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        existingUser.setPicUrl(request.getPicUrl());
        existingUser.setVerificationAttempts(attempts);

        String token = generateVerificationToken();
        existingUser.setVerificationToken(token);
        existingUser.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(verificationTokenExpirationMinutes));

        return userRepository.save(existingUser);
    }

    // Create new user
    private User createNewUser(RegisterRequest request) {
        RoleType roleType = roleRepository.findByRoleType(com.backend.User.enums.RoleType.valueOf(request.getRoleType()))
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPicUrl(request.getPicUrl());
        user.setRoleType(roleType);
        user.setEnabled(false);
        user.setVerificationAttempts(0);

        String token = generateVerificationToken();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(verificationTokenExpirationMinutes));

        return userRepository.save(user);
    }

    // Send verification email
    private void sendVerificationEmail(User user) {
        String verificationLink = baseUrl + "/api/auth/verify?token=" + user.getVerificationToken();
        emailService.sendVerificationEmail(user.getEmail(), verificationLink);
        log.info("Verification email sent to: {}", user.getEmail());
    }

    // Verify email with enhanced error handling
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        // Check token expiration
        if (LocalDateTime.now().isAfter(user.getVerificationTokenExpiry())) {
            // Clear user data for expired token
            userRepository.delete(user);
            throw new RuntimeException("Verification token expired. Please register again.");
        }

        // Mark user as verified
        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        user.setVerificationAttempts(0);
        userRepository.save(user);

        log.info("User email verified: {}", user.getEmail());
    }

    // Login with enhanced authentication
    public String login(LoginRequest request) {
        try {
            // Find user by email first
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

            // Check if user is not verified
            if (!user.isEnabled()) {
                throw new UserNotVerifiedException("Your email is not verified. Please check your inbox.");
            }

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Generate JWT with additional claims if needed
            return jwtService.generateToken(userDetails);

        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for email: {}", request.getEmail());
            throw new RuntimeException("Invalid email or password");
        }
    }

    // Additional utility methods
    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email.matches(emailRegex);
    }

    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}