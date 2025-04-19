package com.backend.Features.Customer.repository;


import com.backend.Features.Customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByUserUserID(int userID);
}
