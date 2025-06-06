package com.backend.User.services;

import com.backend.User.dtos.UserDTO;
import com.backend.User.dtos.UserUpdateDTO;
import com.backend.User.entities.Role;
import com.backend.User.entities.User;
import com.backend.User.repositories.RoleRepository;
import com.backend.User.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // Create a new user
    public User createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("A user with the email '" + userDTO.getEmail() + "' already exists.");
        }

        Optional<Role> role = roleRepository.findByRoleType(userDTO.getRoleType());
        if (role.isEmpty()){
            throw new RuntimeException("Role not found for type '" + userDTO.getRoleType());
        }

        User user = new User();
        user.setName(userDTO.getName());
        user.setSurname(userDTO.getSurname());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setEmail(userDTO.getEmail());
        user.setPicUrl(userDTO.getPicUrl());
        user.setRoleType(role.get());

        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get a user by ID
    public Optional<User> getUserById(int userID) {
        return userRepository.findById(userID);
    }

    // Get a user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Update an existing user
    public User updateUser(int userID, UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findById(userID);
        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found with ID " + userID);
        }

        User user = existingUser.get();
        user.setName(userDTO.getName());
        user.setSurname(userDTO.getSurname());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setEmail(userDTO.getEmail());
        user.setPicUrl(userDTO.getPicUrl());

        Optional<Role> role = roleRepository.findByRoleType(userDTO.getRoleType());
        if (role.isEmpty()) {
            throw new RuntimeException("Role not found for type: '" + userDTO.getRoleType() + "'");
        }
        user.setRoleType(role.get());

        return userRepository.save(user);
    }

    // Update only name, surname, and phone number
    public User updateUserPartial(int userID, UserUpdateDTO updateDTO) {
        Optional<User> existingUser = userRepository.findById(userID);
        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found with ID " + userID);
        }

        User user = existingUser.get();
        user.setName(updateDTO.getName());
        user.setSurname(updateDTO.getSurname());
        user.setPhoneNumber(updateDTO.getPhoneNumber());

        return userRepository.save(user);
    }

    // Get basic info of a user by ID
    public UserUpdateDTO getUserBasicInfoById(int userID) {
        Optional<User> user = userRepository.findById(userID);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with ID " + userID);
        }

        User existingUser = user.get();
        UserUpdateDTO userUpdateDTO = new UserUpdateDTO();
        userUpdateDTO.setName(existingUser.getName());
        userUpdateDTO.setSurname(existingUser.getSurname());
        userUpdateDTO.setPhoneNumber(existingUser.getPhoneNumber());

        return userUpdateDTO;
    }


    // Delete a user
    public void deleteUser(int userID) {
        if (!userRepository.existsById(userID)){
            throw new RuntimeException("User not found with ID: " + userID);
        }
        userRepository.deleteById(userID);
    }
}
