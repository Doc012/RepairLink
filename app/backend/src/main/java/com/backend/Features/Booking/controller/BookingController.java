package com.backend.Features.Booking.controller;

import com.backend.Features.Booking.dto.BookingRequest;
import com.backend.Features.Booking.dto.BookingResponse;
import com.backend.Features.Booking.enums.BookingStatus;
import com.backend.Features.Booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest bookingRequest) {
        BookingResponse bookingResponse = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(bookingResponse);
    }

    @GetMapping("/customer")
    public ResponseEntity<List<BookingResponse>> getBookingsByCustomer(@RequestParam int customerID) {
        List<BookingResponse> bookings = bookingService.getBookingsByCustomer(customerID);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/provider")
    public ResponseEntity<List<BookingResponse>> getBookingsByProvider(@RequestParam int providerID) {
        List<BookingResponse> bookings = bookingService.getBookingsByProvider(providerID);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable int id, @RequestParam BookingStatus status) {
        BookingResponse bookingResponse = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(bookingResponse);
    }
}
