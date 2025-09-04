package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panaromarestaurant.model.CustomerPaymentStatus;

// Defines a repository interface for the CustomerPaymentStatus entity
// Extends JpaRepository to inherit basic CRUD operations
public interface CustomerPaymentStatusDao extends JpaRepository<CustomerPaymentStatus, Integer> {

    // JpaRepository provides the following built-in methods:
    // - findAll(): Retrieve all payment status records
    // - findById(id): Retrieve a specific status by its ID
    // - save(entity): Insert or update a record
    // - delete(entity): Delete a record
    // - count(): Count total number of records

    // Custom methods can be declared here if needed, such as:
    // List<CustomerPaymentStatus> findByName(String name);
}
