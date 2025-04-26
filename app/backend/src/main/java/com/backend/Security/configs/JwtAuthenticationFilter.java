package com.backend.Security.configs;


import com.backend.Security.services.JwtServiceImpl;
import com.backend.Security.services.TokenBlacklistService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtServiceImpl jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;


    public JwtAuthenticationFilter(
            JwtServiceImpl jwtService,
            UserDetailsService userDetailsService,
            TokenBlacklistService tokenBlacklistService
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }


//    @Override
//    protected void doFilterInternal(
//            @NonNull HttpServletRequest request,
//            @NonNull HttpServletResponse response,
//            @NonNull FilterChain filterChain
//    ) throws ServletException, IOException {
//        try {
//            // Extract JWT from cookie
//            Cookie[] cookies = request.getCookies();
//            String jwt = null;
//
//            if (cookies != null) {
//                for (Cookie cookie : cookies) {
//                    if ("jwt".equals(cookie.getName())) {
//                        jwt = cookie.getValue();
//                        break;
//                    }
//                }
//            }
//
//            // If no JWT found in cookies, continue with filter chain
//            if (jwt == null) {
//                filterChain.doFilter(request, response);
//                return;
//            }
//
//            // Check for token expiration
//            if (jwtService.isTokenExpired(jwt)) {
//                logger.debug("Token has expired");
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                response.getWriter().write("Token has expired");
//                return;
//            }
//
//            // Check if token is blacklisted
//            if (tokenBlacklistService.isBlacklisted(jwt)) {
//                logger.debug("Token is blacklisted");
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                response.getWriter().write("Token has been invalidated");
//                return;
//            }
//
//            String userEmail = jwtService.extractUsername(jwt);
//            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
//                if (jwtService.isTokenValid(jwt, userDetails)) {
//                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                            userDetails,
//                            null,
//                            userDetails.getAuthorities()
//                    );
//                    authToken.setDetails(
//                            new WebAuthenticationDetailsSource().buildDetails(request)
//                    );
//                    SecurityContextHolder.getContext().setAuthentication(authToken);
//                    logger.debug("Authentication successful for user: {}", userEmail);
//                }
//            }
//            filterChain.doFilter(request, response);
//
//        } catch (ExpiredJwtException e) {
//            logger.debug("Token has expired", e);
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Token has expired");
//        } catch (JwtException e) {
//            logger.debug("Invalid token", e);
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Invalid token");
//        }
//    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Skip auth for refresh token endpoint
        if (request.getServletPath().contains("/api/auth/refresh-token")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Cookie[] cookies = request.getCookies();
            String jwt = null;
            String refreshToken = null;

            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("jwt".equals(cookie.getName())) {
                        jwt = cookie.getValue();
                    }
                    if ("refresh_token".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                    }
                }
            }

            if (jwt != null) {
                try {
                    String userEmail = jwtService.extractUsername(jwt);
                    if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                        if (jwtService.isTokenValid(jwt, userDetails)) {
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        }
                    }
                } catch (ExpiredJwtException e) {
                    // Token expired, set header to trigger refresh
                    response.setHeader("X-Token-Expired", "true");
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Cannot set user authentication", e);
            filterChain.doFilter(request, response);
        }
    }
}