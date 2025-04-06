package com.backend.Features.ServiceProvider.service;

import com.backend.Features.ServiceProvider.dto.ServiceProviderDTO;
import com.backend.Features.ServiceProvider.entity.ServiceProvider;
import com.backend.Features.ServiceProvider.repository.ServiceProviderRepository;
import com.backend.User.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceProviderService {
    private final ServiceProviderRepository serviceProviderRepository;

    public ServiceProvider createServiceProvider(User user, ServiceProviderDTO serviceProviderDTO) {
        ServiceProvider serviceProvider = new ServiceProvider();
        serviceProvider.setUser(user);
        serviceProvider.setBusinessName(serviceProviderDTO.getBusinessName());
        serviceProvider.setServiceCategory(serviceProviderDTO.getServiceCategory());
        serviceProvider.setLocation(serviceProviderDTO.getLocation());
        serviceProvider.setVerified(serviceProviderDTO.isVerified());
        serviceProvider.setCreatedAt(serviceProviderDTO.getCreatedAt());
        return serviceProviderRepository.save(serviceProvider);
    }

    public ServiceProvider updateServiceProvider(int id, ServiceProviderDTO serviceProviderDTO) {
        ServiceProvider serviceProvider = serviceProviderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceProvider not found"));
        serviceProvider.setBusinessName(serviceProviderDTO.getBusinessName());
        serviceProvider.setServiceCategory(serviceProviderDTO.getServiceCategory());
        serviceProvider.setLocation(serviceProviderDTO.getLocation());
        serviceProvider.setVerified(serviceProviderDTO.isVerified());
        return serviceProviderRepository.save(serviceProvider);
    }

    public void deleteServiceProvider(int id) {
        serviceProviderRepository.deleteById(id);
    }

    public ServiceProvider getServiceProviderById(int id) {
        return serviceProviderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceProvider not found"));
    }

    public List<ServiceProvider> getAllServiceProviders() {
        return serviceProviderRepository.findAll();
    }
}
