package com.backend.User.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class UserUpdateDTO {
    @NotNull(message = "Name cannot be null.")
    private String name;

    @NotNull(message = "Surname cannot be null.")
    private String surname;

    @NotNull(message = "Phone number cannot be null.")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits.")
    private String phoneNumber;

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}