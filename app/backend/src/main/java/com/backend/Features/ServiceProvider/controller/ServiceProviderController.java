package com.backend.Features.ServiceProvider.controller;

import com.backend.Features.ServiceProvider.dto.ServiceProviderDTO;
import com.backend.Features.ServiceProvider.entity.ServiceProvider;
import com.backend.Features.ServiceProvider.service.ServiceProviderService;
import com.backend.User.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/service-providers")
@RequiredArgsConstructor
public class ServiceProviderController {
    private final ServiceProviderService serviceProviderService;

    @PostMapping("/create")
    public ResponseEntity<ServiceProvider> createServiceProvider(
            @RequestBody ServiceProviderDTO serviceProviderDTO) {

        ServiceProvider serviceProvider = serviceProviderService.createServiceProvider(
                serviceProviderDTO, serviceProviderDTO.getUserID());
        return ResponseEntity.ok(serviceProvider);
    }


    @PutMapping("update/{providerID}")
    public ResponseEntity<ServiceProvider> updateServiceProvider(@PathVariable int providerID, @RequestBody ServiceProviderDTO serviceProviderDTO) {
        ServiceProvider serviceProvider = serviceProviderService.updateServiceProvider(providerID, serviceProviderDTO);
        return ResponseEntity.ok(serviceProvider);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteServiceProvider(@PathVariable int id) {
        serviceProviderService.deleteServiceProvider(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceProvider> getServiceProviderById(@PathVariable int id) {
        ServiceProvider serviceProvider = serviceProviderService.getServiceProviderById(id);
        return ResponseEntity.ok(serviceProvider);
    }

    @GetMapping
    public ResponseEntity<List<ServiceProvider>> getAllServiceProviders() {
        List<ServiceProvider> serviceProviders = serviceProviderService.getAllServiceProviders();
        return ResponseEntity.ok(serviceProviders);
    }

    @GetMapping("/by-user/{userID}")
    public ResponseEntity<ServiceProvider> getServiceProviderByUserId(@PathVariable int userID) {
        ServiceProvider serviceProvider = serviceProviderService.getServiceProviderByUserId(userID);
        return ResponseEntity.ok(serviceProvider);
    }


}
