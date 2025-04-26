package com.backend.Features.ServiceHistory.dto;


import java.time.LocalDateTime;


public class ServiceHistoryResponse {
    private int historyID;
    private int customerID;
    private int providerID;
    private int serviceID;
    private LocalDateTime serviceDate;

    public ServiceHistoryResponse() {
    }

    public ServiceHistoryResponse(int historyID, int customerID, int providerID, int serviceID, LocalDateTime serviceDate) {
        this.historyID = historyID;
        this.customerID = customerID;
        this.providerID = providerID;
        this.serviceID = serviceID;
        this.serviceDate = serviceDate;
    }

    public int getHistoryID() {
        return historyID;
    }

    public void setHistoryID(int historyID) {
        this.historyID = historyID;
    }

    public int getCustomerID() {
        return customerID;
    }

    public void setCustomerID(int customerID) {
        this.customerID = customerID;
    }

    public int getProviderID() {
        return providerID;
    }

    public void setProviderID(int providerID) {
        this.providerID = providerID;
    }

    public int getServiceID() {
        return serviceID;
    }

    public void setServiceID(int serviceID) {
        this.serviceID = serviceID;
    }

    public LocalDateTime getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDateTime serviceDate) {
        this.serviceDate = serviceDate;
    }
}
