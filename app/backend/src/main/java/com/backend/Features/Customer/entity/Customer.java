package com.backend.Features.Customer.entity;


import com.backend.User.entities.User;
import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int customerID;

    @OneToOne
    @JoinColumn(name = "userID", referencedColumnName = "userID", unique = true, nullable = false)
    private User user;

    public Customer() {
    }

    public Customer(int customerID, User user) {
        this.customerID = customerID;
        this.user = user;
    }

    public int getCustomerID() {
        return customerID;
    }

    public void setCustomerID(int customerID) {
        this.customerID = customerID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
