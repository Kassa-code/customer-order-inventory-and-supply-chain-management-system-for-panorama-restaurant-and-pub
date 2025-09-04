package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panaromarestaurant.model.CustomerPaymentMethod;

// Defines a repository interface for the CustomerPaymentMethod entity, extending JpaRepository
public interface CustomerPaymentMethodDao extends JpaRepository<CustomerPaymentMethod, Integer> {

    // JpaRepository<CustomerPaymentMethod, Integer>:
    // - CustomerPaymentMethod: The entity class this repository manages
    // - Integer: The type of the entity's primary key

    // JpaRepository provides built-in CRUD operations such as:
    // - findAll(): Retrieve all records
    // - findById(id): Retrieve a specific record by ID
    // - save(entity): Save or update an entity
    // - delete(entity): Remove an entity
    // - count(): Count the number of records

    // Custom query methods can be added here if needed,
    // following Spring Data JPA naming conventions.
}
