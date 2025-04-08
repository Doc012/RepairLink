package com.backend.Features.Customer.controller;

import com.backend.Features.Customer.dto.CustomerDTO;
import com.backend.Features.Customer.entity.Customer;
import com.backend.Features.Customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
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

    @GetMapping("/admin")
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        List<CustomerDTO> customerDTOs = customers.stream().map(customer -> {
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setCustomerID(customer.getCustomerID());
            customerDTO.setUserID(customer.getUser().getUserID());
            return customerDTO;
        }).toList();
        return ResponseEntity.ok(customerDTOs);
    }
}
