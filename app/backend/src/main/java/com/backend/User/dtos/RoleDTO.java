package com.backend.User.dtos;

import com.backend.User.enums.RoleType;
import jakarta.validation.constraints.NotNull;

public class RoleDTO {
    private int roleID;

    @NotNull(message = "Role cannot be null.")
    private RoleType roleType;

    private String description;

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
