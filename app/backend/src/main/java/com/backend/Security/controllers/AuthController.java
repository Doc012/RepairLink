package com.backend.Security.controllers;// Keep only the imports you actually need

import com.backend.Security.dtos.*;
import com.backend.Security.errors.UserAlreadyExistsException;
import com.backend.Security.services.AuthService;
import com.backend.Security.services.JwtService;
import com.backend.Security.services.PasswordService;
import com.backend.Security.services.TokenBlacklistService;
import com.backend.User.entities.User;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletionException;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/auth")
@Slf4j
//@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;
    private final PasswordService passwordService;

    // Keep only this constructor
    @Autowired
    public AuthController(
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            AuthService authService,
            TokenBlacklistService tokenBlacklistService,
            PasswordService passwordService) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.authService = authService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.passwordService = passwordService;
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(request).join();
            return ResponseEntity.ok()
                    .body(Map.of("message", "Registration successful. Please check your email for verification."));

        } catch (CompletionException e) {
            if (e.getCause() instanceof UserAlreadyExistsException) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "An account with this email already exists."));
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    @GetMapping("/verify")
    public void verifyEmail(@RequestParam String token, HttpServletResponse response) throws IOException {
        try {
            authService.verifyEmail(token);
            response.sendRedirect("http://localhost:3000/login");
        } catch (RuntimeException e) {
            log.warn("Email verification failed: {}", e.getMessage());
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.getWriter().write(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            // First authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String accessToken = jwtService.generateToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            // Access token cookie
            Cookie accessTokenCookie = new Cookie("jwt", accessToken);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setSecure(true);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(24 * 60 * 60);

            // Refresh token cookie
            Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);
            refreshTokenCookie.setPath("/api/auth/refresh-token");
            refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);

            response.addCookie(accessTokenCookie);
            response.addCookie(refreshTokenCookie);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Login successful");
            responseBody.put("email", userDetails.getUsername());
            responseBody.put("roles", userDetails.getAuthorities());

            return ResponseEntity.ok(responseBody);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during login");
        }
    }//            String jwt = authService.login(request);
//
//            // ✅ Store JWT in HttpOnly cookie
//            Cookie cookie = new Cookie("jwt", jwt);
//            cookie.setHttpOnly(true); // Prevent JavaScript access
//            cookie.setSecure(true);   // Enable this in production (for HTTPS)
//            cookie.setPath("/");      // Available to entire site
//            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days expiration
//
//            response.addCookie(cookie);
//
//            return ResponseEntity.ok("Login successful");
//        } catch (UserNotVerifiedException e) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email not verified. Please check your inbox.");
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
//        }
//    }
//    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
//        try {
//            String jwt = authService.login(request);
//            return ResponseEntity.ok(new JwtResponse(jwt));
//        } catch (UserNotVerifiedException e) {
//            log.warn("Login attempt for unverified user: {}", request.getEmail());
//            return ResponseEntity
//                    .status(HttpStatus.FORBIDDEN)
//                    .body("Email not verified. Please check your inbox.");
//        } catch (RuntimeException e) {
//            log.warn("Login failed for email: {}", request.getEmail());
//            return ResponseEntity
//                    .status(HttpStatus.UNAUTHORIZED)
//                    .body(e.getMessage());
//        }
//    }


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            // Extract JWT from cookie
            Cookie[] cookies = request.getCookies();
            if (cookies == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("No authentication cookie found");
            }

            String token = null;
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }

            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("No JWT token found in cookies");
            }

            // Validate token and get user details
            UserDetails userDetails = jwtService.validateTokenAndGetUserDetails(token);

            // Create response object
            Map<String, Object> response = new HashMap<>();
            response.put("email", userDetails.getUsername());
            response.put("roles", userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));

            // You might want to add additional user information here
            // For example, if you have a User entity with more details:
            // User user = userService.findByEmail(userDetails.getUsername());
            // response.put("firstName", user.getFirstName());
            // response.put("lastName", user.getLastName());

            return ResponseEntity.ok(response);

        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token has expired");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid authentication token");
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // Extract refresh token from cookie
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("No refresh token found");
        }

        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if ("refresh_token".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
                break;
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("No refresh token found");
        }

        try {
            // Extract username from refresh token
            String username = jwtService.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Validate refresh token
            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                // Generate new access token
                String newAccessToken = jwtService.generateToken(userDetails);

                // Create new access token cookie
                Cookie accessTokenCookie = new Cookie("jwt", newAccessToken);
                accessTokenCookie.setHttpOnly(true);
                accessTokenCookie.setSecure(true); // Enable in production
                accessTokenCookie.setPath("/");
                accessTokenCookie.setMaxAge(24 * 60 * 60); // 24 hours

                // Add cookie to response
                response.addCookie(accessTokenCookie);

                return ResponseEntity.ok()
                        .body("Token refreshed successfully");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid refresh token");
            }
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Refresh token has expired");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing refresh token");
        }
    }






    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Clear both cookies
            Cookie jwtCookie = new Cookie("jwt", null);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(true);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(0);

            Cookie refreshCookie = new Cookie("refresh_token", null);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(true);
            refreshCookie.setPath("/api/auth/refresh-token");
            refreshCookie.setMaxAge(0);

            response.addCookie(jwtCookie);
            response.addCookie(refreshCookie);

            // Get the token from cookie to blacklist it
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("jwt".equals(cookie.getName())) {
                        tokenBlacklistService.blacklistToken(cookie.getValue());
                        break;
                    }
                }
            }

            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            log.error("Logout error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Logout failed");
        }
    }
//    public ResponseEntity<?> logout(HttpServletResponse response, @CookieValue("jwt") String jwt) {
//        // Remove session from Redis
//        redisTemplate.delete("session:" + jwt);
//
//        // Clear cookie
//        Cookie cookie = new Cookie("jwt", null);
//        cookie.setHttpOnly(true);
//        cookie.setSecure(true);
//        cookie.setPath("/");
//        cookie.setMaxAge(0);
//        response.addCookie(cookie);
//
//        return ResponseEntity.ok("Logged out");
//    }
//    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
//        try {
//            if (token != null && token.startsWith("Bearer ")) {
//                String jwt = token.substring(7);
//                tokenBlacklistService.blacklistToken(jwt);
//                return ResponseEntity.ok("Logged out successfully");
//            }
//            return ResponseEntity.badRequest().body("Invalid token");
//        } catch (Exception e) {
//            log.error("Logout error", e);
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Logout failed");
//        }
//    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            passwordService.processForgotPassword(request.getEmail());
            return ResponseEntity.ok()
                    .body("Password reset instructions have been sent to your email");
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