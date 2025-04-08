package com.backend.Features.ServiceHistory.repository;

import com.backend.Features.ServiceHistory.entity.ServiceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceHistoryRepository extends JpaRepository<ServiceHistory, Integer> {
    List<ServiceHistory> findByCustomerCustomerID(int customerID);
    List<ServiceHistory> findByProviderProviderID(int providerID);
}