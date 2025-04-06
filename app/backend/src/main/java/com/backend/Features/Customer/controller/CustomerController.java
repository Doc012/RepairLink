package com.backend.Features.Customer.controller;

import com.backend.Features.Customer.dto.CustomerDTO;
import com.backend.Features.Customer.entity.Customer;
import com.backend.Features.Customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable int id) {
        Customer customer = customerService.getCustomerById(id);
        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setCustomerID(customer.getCustomerID());
        customerDTO.setUserID(customer.getUser().getUserID());
        return ResponseEntity.ok(customerDTO);
    }
}
