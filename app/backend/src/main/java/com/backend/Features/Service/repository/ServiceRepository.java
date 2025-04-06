package com.backend.Features.Service.repository;


import com.backend.Features.Service.entity.ServiceClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceClass, Integer> {
    List<ServiceClass> findByProviderProviderID(int providerID);
}
