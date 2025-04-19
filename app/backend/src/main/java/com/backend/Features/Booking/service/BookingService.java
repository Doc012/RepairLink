package com.backend.Features.Booking.service;

import com.backend.Features.Booking.dto.BookingRequest;
import com.backend.Features.Booking.dto.BookingResponse;
import com.backend.Features.Booking.entity.Booking;
import com.backend.Features.Booking.enums.BookingStatus;
import com.backend.Features.Booking.repository.BookingRepository;
import com.backend.Features.Customer.entity.Customer;
import com.backend.Features.Customer.repository.CustomerRepository;
import com.backend.Features.Service.entity.ServiceClass;
import com.backend.Features.Service.repository.ServiceRepository;
import com.backend.Features.ServiceHistory.entity.ServiceHistory;
import com.backend.Features.ServiceHistory.repository.ServiceHistoryRepository;
import com.backend.Features.ServiceProvider.entity.ServiceProvider;
import com.backend.Features.ServiceProvider.repository.ServiceProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ServiceRepository serviceRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceHistoryRepository serviceHistoryRepository;


    public BookingResponse createBooking(BookingRequest bookingRequest) {
        Customer customer = customerRepository.findById(bookingRequest.getCustomerID())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        ServiceClass serviceClass = serviceRepository.findById(bookingRequest.getServiceID())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        ServiceProvider provider = serviceProviderRepository.findById(bookingRequest.getProviderID())
                .orElseThrow(() -> new RuntimeException("ServiceProvider not found"));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setServiceClass(serviceClass);
        booking.setProvider(provider);
        booking.setBookingDate(bookingRequest.getBookingDate());
        booking.setAdditionalNotes(bookingRequest.getAdditionalNotes());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        return mapToBookingResponse(savedBooking);
    }

    public List<BookingResponse> getBookingsByCustomer(int customerID) {
        List<Booking> bookings = bookingRepository.findByCustomerCustomerID(customerID);
        return bookings.stream().map(this::mapToBookingResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByProvider(int providerID) {
        List<Booking> bookings = bookingRepository.findByProviderProviderID(providerID);
        return bookings.stream().map(this::mapToBookingResponse).collect(Collectors.toList());
    }

    public BookingResponse updateBookingStatus(int bookingID, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingID)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(newStatus);
        bookingRepository.save(booking);

        if (newStatus == BookingStatus.COMPLETED) {
            ServiceHistory serviceHistory = new ServiceHistory();
            serviceHistory.setCustomer(booking.getCustomer());
            serviceHistory.setProvider(booking.getProvider());
            serviceHistory.setService(booking.getServiceClass());
            serviceHistory.setBooking(booking);
            serviceHistory.setServiceDate(LocalDateTime.now());

            serviceHistoryRepository.save(serviceHistory);
        }

        return convertToBookingResponse(booking);
    }

    private BookingResponse convertToBookingResponse(Booking booking) {
        BookingResponse bookingResponse = new BookingResponse();
        bookingResponse.setBookingID(booking.getBookingID());
        bookingResponse.setCustomerID(booking.getCustomer().getCustomerID());
        bookingResponse.setProviderID(booking.getProvider().getProviderID());
        bookingResponse.setServiceID(booking.getServiceClass().getServiceID());
        bookingResponse.setStatus(booking.getStatus().name());
        bookingResponse.setBookingDate(booking.getBookingDate());
        bookingResponse.setAdditionalNotes(booking.getAdditionalNotes());
        return bookingResponse;
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingID(booking.getBookingID());
        response.setCustomerID(booking.getCustomer().getCustomerID());
        response.setServiceID(booking.getServiceClass().getServiceID());
        response.setProviderID(booking.getProvider().getProviderID());
        response.setBookingDate(booking.getBookingDate());
        response.setAdditionalNotes(booking.getAdditionalNotes());
        response.setStatus(booking.getStatus().name());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }
}
