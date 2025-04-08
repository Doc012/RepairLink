package com.backend.User.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "roles") // Match the table name in the database
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roleID")
    private int roleID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private com.backend.User.enums.RoleType roleType;

    @Column(length = 5000, name = "description")
    private String description;

    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Role() {
    }

    public Role(int roleID, com.backend.User.enums.RoleType roleType, String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.roleID = roleID;
        this.roleType = roleType;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }

    public com.backend.User.enums.RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(com.backend.User.enums.RoleType roleType) {
        this.roleType = roleType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}