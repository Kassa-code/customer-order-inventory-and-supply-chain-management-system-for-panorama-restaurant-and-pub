package com.panaromarestaurant.repository;

// Importing Spring Data JPA's JpaRepository interface
import org.springframework.data.jpa.repository.JpaRepository;

// Importing the DeliverStatus model class
import com.panaromarestaurant.model.DeliverStatus;

// Repository interface for DeliverStatus entity, extending JpaRepository
// Provides CRUD operations and query method support for DeliverStatus objects
public interface DeliveryStatusDao extends JpaRepository<DeliverStatus, Integer> {

    // JpaRepository offers built-in methods such as:
    // - findAll(): Retrieve all DeliverStatus records from the database
    // - findById(Integer id): Retrieve a DeliverStatus record by its ID
    // - save(DeliverStatus entity): Save or update a DeliverStatus entity
    // - delete(DeliverStatus entity): Delete a DeliverStatus record
    // - count(): Get the total number of DeliverStatus records

    // Custom query methods can also be added here by following
    // Spring Data JPA method naming conventions
}
