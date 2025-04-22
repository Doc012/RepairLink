package com.backend.Features.ServiceProvider.repository;

import com.backend.Features.ServiceProvider.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Integer> {
    Optional<ServiceProvider> findByUser_UserID(int userID);
}
