package com.backend.User.controllers;

import com.backend.User.dtos.UserDTO;
import com.backend.User.dtos.UserUpdateDTO;
import com.backend.User.entities.User;
import com.backend.User.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Create a new user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO userDTO) {
        User user = userService.createUser(userDTO);
        return ResponseEntity.ok(user);
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get a user by ID
    @GetMapping({"/{userID}"})
    public ResponseEntity<User> getUserById(@PathVariable int userID) {
        Optional<User> user = userService.getUserById(userID);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get a user by email
    @GetMapping("/by-email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a user
    @PutMapping("user/{userID}")
    public ResponseEntity<User> updateUser(@PathVariable int userID, @RequestBody UserDTO userDTO) {
        User updatedUser = userService.updateUser(userID, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // Update user's name, surname and phone number only
    @PutMapping("/{userID}/basic-info")
    public ResponseEntity<User> updateUserBasicInfo(@PathVariable int userID, @RequestBody UserUpdateDTO updateDTO) {
        User updatedUser = userService.updateUserPartial(userID, updateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // Get basic info of a user by ID
    @GetMapping("/{userID}/basic-info")
    public ResponseEntity<UserUpdateDTO> getUserBasicInfoById(@PathVariable int userID) {
        UserUpdateDTO userUpdateDTO = userService.getUserBasicInfoById(userID);
        return ResponseEntity.ok(userUpdateDTO);
    }

    //Delete a user
    @DeleteMapping("/{userID}")
    public ResponseEntity<Void> deleteUser(@PathVariable int userID) {
        userService.deleteUser(userID);
        return ResponseEntity.noContent().build();
    }
}
