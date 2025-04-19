package com.backend.Features.ServiceHistory.controller;


import com.backend.Features.ServiceHistory.dto.ServiceHistoryResponse;
import com.backend.Features.ServiceHistory.service.ServiceHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/service-history")
@RequiredArgsConstructor
public class ServiceHistoryController {
    private final ServiceHistoryService serviceHistoryService;

    @GetMapping("/customer/{customerID}")
    public ResponseEntity<List<ServiceHistoryResponse>> getServiceHistoryByCustomer(@PathVariable int customerID) {
        List<ServiceHistoryResponse> history = serviceHistoryService.getServiceHistoryByCustomer(customerID);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/provider/{providerID}")
    public ResponseEntity<List<ServiceHistoryResponse>> getServiceHistoryByProvider(@PathVariable int providerID) {
        List<ServiceHistoryResponse> history = serviceHistoryService.getServiceHistoryByProvider(providerID);
        return ResponseEntity.ok(history);
    }
}
