package com.backend.Security.dtos;

import com.backend.User.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {
    private int userID;

    @NotNull(message = "Name cannot be null.")
    private String name;


    @NotNull(message = "Surname cannot be null.")
    private String surname;

    @NotNull(message = "Phone number cannot be null.")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits.")
    private String phoneNumber;

    @NotNull(message = "Email cannot be null.")
    @Email(message = "Invalid email address.")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String picUrl;

    @NotNull(message = "Role cannot be null.")
    private int roleID;


    @NotNull(message = "Role cannot be null.")
    private String roleType;

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public @NotNull(message = "Name cannot be null.") String getName() {
        return name;
    }

    public void setName(@NotNull(message = "Name cannot be null.") String name) {
        this.name = name;
    }

    public @NotNull(message = "Surname cannot be null.") String getSurname() {
        return surname;
    }

    public void setSurname(@NotNull(message = "Surname cannot be null.") String surname) {
        this.surname = surname;
    }

    public @NotNull(message = "Phone number cannot be null.") @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits.") String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(@NotNull(message = "Phone number cannot be null.") @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits.") String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public @NotNull(message = "Email cannot be null.") @Email(message = "Invalid email address.") String getEmail() {
        return email;
    }

    public void setEmail(@NotNull(message = "Email cannot be null.") @Email(message = "Invalid email address.") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Password is required") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password is required") String password) {
        this.password = password;
    }

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    @NotNull(message = "Role cannot be null.")
    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(@NotNull(message = "Role cannot be null.") int roleID) {
        this.roleID = roleID;
    }

    public @NotNull(message = "Role cannot be null.") String getRoleType() {
        return roleType;
    }

    public void setRoleType(@NotNull(message = "Role cannot be null.") String roleType) {
        this.roleType = roleType;
    }
}

