package com.backend.Features.ServiceProvider.entity;

import com.backend.User.entities.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_providers")
public class ServiceProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int providerID;

    @OneToOne
    @JoinColumn(name = "userID", referencedColumnName = "userID", unique = true, nullable = false)
    private User user;

    @Column(name = "businessName", nullable = false)
    private String businessName;

    @Column(name = "serviceCategory", nullable = false)
    private String serviceCategory;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "about", nullable = false)
    private String about;

    @Column(name = "phoneNumber", nullable = false)
    private String phoneNumber;

    @Column(name = "businessEmail")
    private String businessEmail;

    @Column(name = "website")
    private String website;

    @Column(name = "verified", nullable = false)
    private boolean verified;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    public ServiceProvider() {
    }

    public ServiceProvider(int providerID, User user, String businessName, String serviceCategory, String location, String about, String phoneNumber, String businessEmail, String website, boolean verified, LocalDateTime createdAt) {
        this.providerID = providerID;
        this.user = user;
        this.businessName = businessName;
        this.serviceCategory = serviceCategory;
        this.location = location;
        this.about = about;
        this.phoneNumber = phoneNumber;
        this.businessEmail = businessEmail;
        this.website = website;
        this.verified = verified;
        this.createdAt = createdAt;
    }

    public int getProviderID() {
        return providerID;
    }

    public void setProviderID(int providerID) {
        this.providerID = providerID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getServiceCategory() {
        return serviceCategory;
    }

    public void setServiceCategory(String serviceCategory) {
        this.serviceCategory = serviceCategory;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getBusinessEmail() {
        return businessEmail;
    }

    public void setBusinessEmail(String businessEmail) {
        this.businessEmail = businessEmail;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
