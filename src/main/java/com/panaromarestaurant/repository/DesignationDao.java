package com.panaromarestaurant.repository; // Define the package for the repository

import org.springframework.data.jpa.repository.JpaRepository; // Import JpaRepository for database operations
import com.panaromarestaurant.model.Designation; // Import the Designation entity/model

// Defines a repository interface for the Designation entity, extending JpaRepository
public interface DesignationDao extends JpaRepository<Designation, Integer> {
    // JpaRepository provides built-in CRUD operations such as:
    // - findAll(): Retrieve all records
    // - findById(id): Retrieve a specific record by ID
    // - save(entity): Save or update an entity
    // - delete(entity): Remove an entity
    // - count(): Count the number of records

    // Custom query methods can be added if needed, following Spring Data JPA conventions.
}
