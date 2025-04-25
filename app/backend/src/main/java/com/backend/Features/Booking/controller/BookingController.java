package com.backend.Features.Booking.controller;

import com.backend.Features.Booking.dto.BookingRequest;
import com.backend.Features.Booking.dto.BookingResponse;
import com.backend.Features.Booking.enums.BookingStatus;
import com.backend.Features.Booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PutMapping("/status/{bookingID}")
    public ResponseEntity<BookingResponse> updateBookingStatus(@RequestBody Map<String, String> requestBody, @PathVariable int bookingID) {
        BookingStatus newStatus = BookingStatus.valueOf(requestBody.get("newStatus"));
        BookingResponse bookingResponse = bookingService.updateBookingStatus(bookingID, newStatus);
        return ResponseEntity.ok(bookingResponse);
    }
}
