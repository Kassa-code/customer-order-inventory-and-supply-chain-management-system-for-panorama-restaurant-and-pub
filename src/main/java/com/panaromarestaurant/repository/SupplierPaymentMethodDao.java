package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panaromarestaurant.model.SupplierPaymentMethod;

// Defines a repository interface for the SupplierPaymentMethod entity, extending JpaRepository
public interface SupplierPaymentMethodDao extends JpaRepository<SupplierPaymentMethod, Integer> {

    // JpaRepository provides built-in CRUD operations such as:
    // - findAll(): Retrieve all records
    // - findById(id): Retrieve a specific record by ID
    // - save(entity): Save or update an entity
    // - delete(entity): Remove an entity
    // - count(): Count the number of records

    // Custom query methods can be added if needed, following Spring Data JPA
    // conventions.
}
