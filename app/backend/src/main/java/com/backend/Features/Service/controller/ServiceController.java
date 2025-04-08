package com.backend.Features.Service.controller;

import com.backend.Features.Service.dto.ServiceRequest;
import com.backend.Features.Service.dto.ServiceResponse;
import com.backend.Features.Service.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class ServiceController {
    private final ServiceService serviceService;

    @PostMapping("/create")
    public ResponseEntity<ServiceResponse> createService(@RequestBody ServiceRequest serviceRequest) {
        ServiceResponse serviceResponse = serviceService.createService(serviceRequest);
        return ResponseEntity.ok(serviceResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ServiceResponse> updateService(@PathVariable int id, @RequestBody ServiceRequest serviceRequest) {
        ServiceResponse serviceResponse = serviceService.updateService(id, serviceRequest);
        return ResponseEntity.ok(serviceResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable int id) {
        ServiceResponse serviceResponse = serviceService.getServiceById(id);
        return ResponseEntity.ok(serviceResponse);
    }

    @GetMapping("/provider/{providerID}")
    public ResponseEntity<List<ServiceResponse>> getAllServicesByProvider(@PathVariable int providerID) {
        List<ServiceResponse> services = serviceService.getAllServicesByProvider(providerID);
        return ResponseEntity.ok(services);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable int id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
