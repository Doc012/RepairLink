package com.backend.Features.Booking.entity;

import com.backend.Features.Booking.enums.BookingStatus;
import com.backend.Features.Customer.entity.Customer;
import com.backend.Features.Service.entity.ServiceClass;
import com.backend.Features.ServiceProvider.entity.ServiceProvider;
import jakarta.persistence.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookingID;

    @ManyToOne
    @JoinColumn(name = "customerID", referencedColumnName = "customerID", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "serviceID", referencedColumnName = "serviceID", nullable = false)
    private ServiceClass serviceClass;

    @ManyToOne
    @JoinColumn(name = "providerID", referencedColumnName = "providerID", nullable = false)
    private ServiceProvider provider;

    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    public Booking() {
    }

    public Booking(int bookingID, Customer customer, ServiceClass serviceClass, ServiceProvider provider, LocalDateTime bookingDate, BookingStatus status, LocalDateTime createdAt) {
        this.bookingID = bookingID;
        this.customer = customer;
        this.serviceClass = serviceClass;
        this.provider = provider;
        this.bookingDate = bookingDate;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getBookingID() {
        return bookingID;
    }

    public void setBookingID(int bookingID) {
        this.bookingID = bookingID;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public ServiceClass getServiceClass() {
        return serviceClass;
    }

    public void setServiceClass(ServiceClass serviceClass) {
        this.serviceClass = serviceClass;
    }

    public ServiceProvider getProvider() {
        return provider;
    }

    public void setProvider(ServiceProvider provider) {
        this.provider = provider;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
