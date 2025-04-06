package com.backend.Features.Review.repository;

import com.backend.Features.Review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByBookingServiceClassServiceID(int serviceID);
    List<Review> findByBookingProviderProviderID(int providerID);
    List<Review> findByCustomerCustomerID(int customerID);
}