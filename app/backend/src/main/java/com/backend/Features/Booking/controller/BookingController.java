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
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping("/customer")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest bookingRequest) {
        BookingResponse bookingResponse = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(bookingResponse);
    }

//    @GetMapping("/customer")
//    public ResponseEntity<List<BookingResponse>> getBookingsByCustomer(@RequestParam int customerID) {
//        List<BookingResponse> bookings = bookingService.getBookingsByCustomer(customerID);
//        return ResponseEntity.ok(bookings);
//    }

    @GetMapping("/customer")
    public ResponseEntity<List<BookingResponse>> getBookingsByCustomer(@RequestParam int customerID) {
        // Make sure this parameter name matches the one in your frontend API call
        List<BookingResponse> bookings = bookingService.getBookingsByCustomer(customerID);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/provider/{providerID}")
    public ResponseEntity<List<BookingResponse>> getBookingsByProvider(@PathVariable int providerID) {
        List<BookingResponse> bookings = bookingService.getBookingsByProvider(providerID);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<BookingResponse> updateBookingStatus(@RequestParam BookingStatus status, @PathVariable int id) {
        BookingResponse bookingResponse = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(bookingResponse);
    }
}
