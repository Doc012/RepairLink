package com.backend.Features.ServiceProvider.repository;

import com.backend.Features.ServiceProvider.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Integer> {
}
