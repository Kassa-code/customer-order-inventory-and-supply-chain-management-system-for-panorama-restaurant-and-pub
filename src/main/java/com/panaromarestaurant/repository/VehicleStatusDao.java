package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.VehicleStatus;

// Repository interface for VehicleStatus entity, extending JpaRepository
// Provides CRUD operations and query method support for VehicleStatus objects
public interface VehicleStatusDao extends JpaRepository<VehicleStatus, Integer> {

    // JpaRepository offers built-in methods such as:
    // - findAll(): Get all VehicleStatus records
    // - findById(Integer id): Find a VehicleStatus by its ID
    // - save(VehicleStatus entity): Insert or update a VehicleStatus
    // - delete(VehicleStatus entity): Delete a VehicleStatus record
    // - count(): Get total number of VehicleStatus records

    // Additional custom queries can be defined here as needed,
    // following Spring Data JPA method naming conventions.
}
