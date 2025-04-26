package com.backend.Features.Booking.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {
    private int bookingID;
    private int customerID;
    private int serviceID;
    private int providerID;
    private LocalDateTime bookingDate;
    private String additionalNotes;
    private String status;
    private LocalDateTime createdAt;

//    ___________________________________________________________________________________________
//    Backend modification to Include More Information (Long-term Solution)
//    The best solution is to include more information in the bookings endpoint response. I could:
//
//    Join the bookings table with services and providers tables in your SQL query
//    Include the necessary fields in the BookingResponse DTO
//    Example BookingResponse DTO:

//    // Additional fields from Service
//    private String serviceName;
//    private BigDecimal price;
//
//    // Additional fields from Provider
//    private String providerName;
//    private String location;
//    private String phoneNumber;

//    ____________________________________________________________________________________________

    public int getBookingID() {
        return bookingID;
    }

    public void setBookingID(int bookingID) {
        this.bookingID = bookingID;
    }

    public int getCustomerID() {
        return customerID;
    }

    public void setCustomerID(int customerID) {
        this.customerID = customerID;
    }

    public int getServiceID() {
        return serviceID;
    }

    public void setServiceID(int serviceID) {
        this.serviceID = serviceID;
    }

    public int getProviderID() {
        return providerID;
    }

    public void setProviderID(int providerID) {
        this.providerID = providerID;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
