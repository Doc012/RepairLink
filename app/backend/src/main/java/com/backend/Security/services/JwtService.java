package com.backend.Security.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration:86400000}") // 24 hours in milliseconds
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}") // 7 days in milliseconds
    private long refreshTokenExpiration;

    // Generate access token with additional claims
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, accessTokenExpiration);
    }

    // Generate token with extra claims
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        // Add role-based claims
        extraClaims.put("role", userDetails.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_USER"));

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusMillis(expiration)))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Generate refresh token
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, refreshTokenExpiration);
    }

    // Token validation with enhanced logging and error handling
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            boolean isValid = (username.equals(userDetails.getUsername()) && !isTokenExpired(token));

            if (!isValid) {
                log.warn("Invalid token for user: {}", username);
            }

            return isValid;
        } catch (SignatureException e) {
            log.error("JWT signature validation failed", e);
            return false;
        } catch (ExpiredJwtException e) {
            log.warn("JWT token has expired for user: {}", e.getClaims().getSubject());
            return false;
        } catch (Exception e) {
            log.error("Token validation error", e);
            return false;
        }
    }

    // Extract username with error handling
    public String extractUsername(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
            log.error("Error extracting username from token", e);
            throw new RuntimeException("Invalid token", e);
        }
    }

    // Enhanced expiration check
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            boolean isExpired = expiration.before(Date.from(Instant.now()));

            if (isExpired) {
                log.info("Token expired at: {}", expiration);
            }

            return isExpired;
        } catch (Exception e) {
            log.error("Error checking token expiration", e);
            return true;
        }
    }

    // Extract specific claim with error handling
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        } catch (Exception e) {
            log.error("Error extracting claim from token", e);
            throw new RuntimeException("Invalid token", e);
        }
    }

    // Extract all claims with improved security
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token", e);
            throw e;
        } catch (SignatureException e) {
            log.error("JWT signature does not match", e);
            throw e;
        } catch (Exception e) {
            log.error("Error parsing JWT token", e);
            throw new RuntimeException("Invalid token", e);
        }
    }

    // Get signing key
    private Key getSignInKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            log.error("Error generating signing key", e);
            throw new RuntimeException("Error generating signing key", e);
        }
    }

    // Extract expiration date
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Additional method to get token payload without validation (for debugging)
    public Map<String, Object> getTokenPayload(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return new HashMap<>(claims);
        } catch (Exception e) {
            log.error("Error extracting token payload", e);
            return new HashMap<>();
        }
    }


}