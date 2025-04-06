package com.backend.Security.repositories;

import com.backend.Security.entities.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, String> {
    @Query("SELECT b FROM BlacklistedToken b WHERE b.expiresAt > :now")
    List<BlacklistedToken> findAllValidTokens(LocalDateTime now);

    @Modifying
    @Query("DELETE FROM BlacklistedToken b WHERE b.expiresAt <= :now")
    void deleteExpiredTokens(LocalDateTime now);
}