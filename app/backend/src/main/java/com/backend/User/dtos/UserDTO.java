package com.backend.User.dtos;

import com.backend.User.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class UserDTO {

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

    private String picUrl;

    @NotNull(message = "Role cannot be null.")
    private RoleType roleType;

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }
}
