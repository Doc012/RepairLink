package com.backend.Features.ServiceHistory.service;

import com.backend.Features.ServiceHistory.dto.ServiceHistoryResponse;
import com.backend.Features.ServiceHistory.entity.ServiceHistory;
import com.backend.Features.ServiceHistory.repository.ServiceHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceHistoryService {
    private final ServiceHistoryRepository serviceHistoryRepository;

    public List<ServiceHistoryResponse> getServiceHistoryByCustomer(int customerID) {
        List<ServiceHistory> history = serviceHistoryRepository.findByCustomerCustomerID(customerID);
        return history.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ServiceHistoryResponse> getServiceHistoryByProvider(int providerID) {
        List<ServiceHistory> history = serviceHistoryRepository.findByProviderProviderID(providerID);
        return history.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ServiceHistoryResponse mapToResponse(ServiceHistory serviceHistory) {
        return new ServiceHistoryResponse(
                serviceHistory.getHistoryID(),
                serviceHistory.getCustomer().getCustomerID(),
                serviceHistory.getProvider().getProviderID(),
                serviceHistory.getService().getServiceID(),
                serviceHistory.getServiceDate()
        );
    }
}
