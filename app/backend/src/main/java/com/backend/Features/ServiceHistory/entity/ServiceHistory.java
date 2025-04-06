package com.backend.Features.ServiceHistory.entity;


import com.backend.Features.Booking.entity.Booking;
import com.backend.Features.Customer.entity.Customer;
import com.backend.Features.Service.entity.ServiceClass;
import com.backend.Features.ServiceProvider.entity.ServiceProvider;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_history")
@Data
public class ServiceHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int historyID;

    @ManyToOne
    @JoinColumn(name = "customerID", referencedColumnName = "customerID", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "providerID", referencedColumnName = "providerID", nullable = false)
    private ServiceProvider provider;

    @ManyToOne
    @JoinColumn(name = "serviceID", referencedColumnName = "serviceID", nullable = false)
    private ServiceClass service;

    @OneToOne
    @JoinColumn(name = "bookingID", referencedColumnName = "bookingID", nullable = false)
    private Booking booking;

    @Column(name = "serviceDate", nullable = false)
    private LocalDateTime serviceDate;

    public ServiceHistory() {
    }

    public ServiceHistory(int historyID, Customer customer, ServiceProvider provider, ServiceClass service, Booking booking, LocalDateTime serviceDate) {
        this.historyID = historyID;
        this.customer = customer;
        this.provider = provider;
        this.service = service;
        this.booking = booking;
        this.serviceDate = serviceDate;
    }

    public int getHistoryID() {
        return historyID;
    }

    public void setHistoryID(int historyID) {
        this.historyID = historyID;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public ServiceProvider getProvider() {
        return provider;
    }

    public void setProvider(ServiceProvider provider) {
        this.provider = provider;
    }

    public ServiceClass getService() {
        return service;
    }

    public void setService(ServiceClass service) {
        this.service = service;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public LocalDateTime getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDateTime serviceDate) {
        this.serviceDate = serviceDate;
    }
}
