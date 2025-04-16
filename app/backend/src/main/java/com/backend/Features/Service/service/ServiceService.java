package com.backend.Features.Service.service;


import com.backend.Features.Service.dto.ServiceRequest;
import com.backend.Features.Service.dto.ServiceResponse;
import com.backend.Features.Service.entity.ServiceClass;
import com.backend.Exceptions.services.UnverifiedProviderException;
import com.backend.Features.Service.repository.ServiceRepository;
import com.backend.Features.ServiceProvider.entity.ServiceProvider;
import com.backend.Features.ServiceProvider.repository.ServiceProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceService {
    private final ServiceRepository serviceRepository;
    private final ServiceProviderRepository serviceProviderRepository;

    public ServiceResponse createService(ServiceRequest serviceRequest) {
        ServiceProvider provider = serviceProviderRepository.findById(serviceRequest.getProviderID())
                .orElseThrow(() -> new RuntimeException("ServiceProvider not found"));

        if (!provider.isVerified()) {
            throw new UnverifiedProviderException("The service provider is not verified and cannot create services.");
        }

        ServiceClass serviceClass = new ServiceClass();
        serviceClass.setProvider(provider);
        serviceClass.setServiceName(serviceRequest.getServiceName());
        serviceClass.setDescription(serviceRequest.getDescription());
        serviceClass.setPrice(serviceRequest.getPrice());
        serviceClass.setDuration(serviceRequest.getDuration());
        serviceClass.setCreatedAt(LocalDateTime.now());

        ServiceClass savedService = serviceRepository.save(serviceClass);
        return mapToServiceResponse(savedService);
    }

    public ServiceResponse updateService(int id, ServiceRequest serviceRequest) {
        ServiceClass serviceClass = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        serviceClass.setServiceName(serviceRequest.getServiceName());
        serviceClass.setDescription(serviceRequest.getDescription());
        serviceClass.setPrice(serviceRequest.getPrice());
        serviceClass.setDuration(serviceRequest.getDuration());

        ServiceClass updatedService = serviceRepository.save(serviceClass);
        return mapToServiceResponse(updatedService);
    }

    public ServiceResponse getServiceById(int id) {
        ServiceClass serviceClass = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        return mapToServiceResponse(serviceClass);
    }

    public List<ServiceResponse> getAllServicesByProvider(int providerID) {
        List<ServiceClass> serviceClass = serviceRepository.findByProviderProviderID(providerID);
        return serviceClass.stream().map(this::mapToServiceResponse).collect(Collectors.toList());
    }

    public void deleteService(int id) {
        serviceRepository.deleteById(id);
    }

    private ServiceResponse mapToServiceResponse(ServiceClass service) {
        ServiceResponse response = new ServiceResponse();
        response.setServiceID(service.getServiceID());
        response.setProviderID(service.getProvider().getProviderID());
        response.setServiceName(service.getServiceName());
        response.setDescription(service.getDescription());
        response.setPrice(service.getPrice());
        response.setDuration(service.getDuration());
        response.setCreatedAt(service.getCreatedAt());
        return response;
    }
}
