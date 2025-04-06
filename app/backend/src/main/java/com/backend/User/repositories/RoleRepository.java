package com.backend.User.repositories;

import com.backend.User.entities.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleType, Integer> {

    // Find a role by its type
    Optional<RoleType> findByRoleType(com.backend.User.enums.RoleType roleType);

    // Check if a role exists by its type
    boolean existsByRoleType(com.backend.User.enums.RoleType roleType);

    // Find all roles by a list of role types
    List<RoleType> findByRoleTypeIn(List<com.backend.User.enums.RoleType> roleTypes);

    // Find a role by its ID
    Optional<RoleType> findById(int roleID);

    // Find all roles
    List<RoleType> findAll();

    // Delete a role by its type
    void deleteByRoleType(com.backend.User.enums.RoleType roleType);

    // Count the number of roles by type
    long countByRoleType(com.backend.User.enums.RoleType roleType);
}