package com.panaromarestaurant.repository; // Defines the package for the repository

import org.springframework.data.jpa.repository.JpaRepository; // Imports JpaRepository for database operations
import com.panaromarestaurant.model.EmployeeStatus; // Imports the EmployeeStatus entity/model

// Defines a repository interface for the EmployeeStatus entity, extending JpaRepository
public interface EmployeeStatusDao extends JpaRepository<EmployeeStatus, Integer> {
    // JpaRepository provides built-in CRUD operations such as:
    // - findAll(): Retrieve all records
    // - findById(id): Retrieve a specific record by ID
    // - save(entity): Save or update an entity
    // - delete(entity): Remove an entity
    // - count(): Count the number of records

    // Custom query methods can be added if needed, following Spring Data JPA conventions.
}
