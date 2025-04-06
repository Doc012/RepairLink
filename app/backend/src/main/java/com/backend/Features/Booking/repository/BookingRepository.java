package com.backend.Features.Booking.repository;

import com.backend.Features.Booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByCustomerCustomerID(int customerID);
    List<Booking> findByProviderProviderID(int providerID);
}
