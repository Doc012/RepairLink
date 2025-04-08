package com.backend.User.controllers;

import com.backend.User.dtos.RoleDTO;
import com.backend.User.entities.Role;
import com.backend.User.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // Create a new role
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody RoleDTO roleDTO) {
        Role role = roleService.createRole(roleDTO);
        return ResponseEntity.ok(role);
    }

    // Get all roles
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    // Get a role by ID
    @GetMapping("/{roleID}")
    public ResponseEntity<Role> getRoleByID(@PathVariable int roleID) {
        Optional<Role> role = roleService.getRoleByID(roleID);
        if (role.isPresent()) {
            return ResponseEntity.ok(role.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get a role by type
    @GetMapping("/role-type/{roleType}")
    public ResponseEntity<Role> getRoleByType(@PathVariable com.backend.User.enums.RoleType roleType) {
        Optional<Role> role = roleService.getRoleByType(roleType);
        if (role.isPresent()) {
            return ResponseEntity.ok(role.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update a role
    @PutMapping("/{roleID}")
    public ResponseEntity<Role> updateRole(@PathVariable int roleID, @RequestBody RoleDTO roleDTO) {
        Role role = roleService.updateRole(roleID, roleDTO);
        return ResponseEntity.ok(role);
    }

    // Delete a role
    @DeleteMapping("/{roleID}")
    public ResponseEntity<Void> deleteRole(@PathVariable int roleID) {
        roleService.deleteRole(roleID);
        return ResponseEntity.ok().build();
    }
}
