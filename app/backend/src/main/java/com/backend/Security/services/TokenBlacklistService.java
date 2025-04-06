package com.backend.Security.services;

import com.backend.Security.entities.BlacklistedToken;
import com.backend.Security.repositories.BlacklistedTokenRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {
    private static final Logger logger = LoggerFactory.getLogger(TokenBlacklistService.class);
    private static final String REDIS_PREFIX = "blacklisted_token:";

    private final RedisTemplate<String, String> redisTemplate;
    private final BlacklistedTokenRepository tokenRepository;
    private final JwtService jwtService;

    public TokenBlacklistService(
            RedisTemplate<String, String> redisTemplate,
            BlacklistedTokenRepository tokenRepository,
            JwtService jwtService) {
        this.redisTemplate = redisTemplate;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;

        initializeRedisFromDatabase();
    }

    @PostConstruct
    public void initializeRedisFromDatabase() {
        logger.info("Initializing Redis blacklist from database...");
        List<BlacklistedToken> validTokens = tokenRepository.findAllValidTokens(LocalDateTime.now());

        for (BlacklistedToken token : validTokens) {
            long ttlMillis = ChronoUnit.MILLIS.between(
                    LocalDateTime.now(),
                    token.getExpiresAt()
            );

            if (ttlMillis > 0) {
                redisTemplate.opsForValue().set(
                        REDIS_PREFIX + token.getToken(),
                        "blacklisted",
                        ttlMillis,
                        TimeUnit.MILLISECONDS
                );
            }
        }
        logger.info("Initialized {} tokens in Redis", validTokens.size());
    }

    @Transactional
    public void blacklistToken(String token) {
        // Extract token expiration
        Date expirationDate = jwtService.extractExpiration(token);
        LocalDateTime expiresAt = expirationDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        // Store in Redis
        long ttlMillis = ChronoUnit.MILLIS.between(
                LocalDateTime.now(),
                expiresAt
        );

        if (ttlMillis > 0) {
            // Save to Redis
            redisTemplate.opsForValue().set(
                    REDIS_PREFIX + token,
                    "blacklisted",
                    ttlMillis,
                    TimeUnit.MILLISECONDS
            );

            // Save to Database
            BlacklistedToken blacklistedToken = new BlacklistedToken(
                    token,
                    LocalDateTime.now(),
                    expiresAt
            );
            tokenRepository.save(blacklistedToken);

            logger.info("Token blacklisted in both Redis and database");
        }
    }

    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(
                redisTemplate.hasKey(REDIS_PREFIX + token)
        );
    }

    // Cleanup job to remove expired tokens from database
    @Scheduled(cron = "0 0 * * * *") // Run every hour
    @Transactional
    public void cleanupExpiredTokens() {
        logger.info("Running cleanup job for expired tokens");
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}

