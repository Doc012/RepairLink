package com.backend.Features.ServiceHistory.repository;

import com.backend.Features.ServiceHistory.entity.ServiceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceHistoryRepository extends JpaRepository<ServiceHistory, Integer> {
}
