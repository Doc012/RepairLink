package com.backend.Features.Customer.service;

import com.backend.Features.Customer.entity.Customer;
import com.backend.Features.Customer.repository.CustomerRepository;
import com.backend.User.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;


    public Customer createCustomer(User user) {
        Customer customer = new Customer();
        customer.setUser(user);
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(int id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}
