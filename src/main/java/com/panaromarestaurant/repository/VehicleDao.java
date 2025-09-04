package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Vehicle;

// Repository interface for Vehicle entity, extending JpaRepository
// Provides CRUD operations and query method support for Vehicle objects
public interface VehicleDao extends JpaRepository<Vehicle, Integer> {

     @Query (value = "SELECT * FROM panaromarestaurant.vehicle as v where v.vehicle_status_id = 1;",nativeQuery = true)
    List<Vehicle> getAvailableVehicles();

    // JpaRepository offers built-in methods such as:
    // - findAll(): Retrieve all Vehicle records
    // - findById(Integer id): Find a Vehicle by its ID
    // - save(Vehicle entity): Insert or update a Vehicle
    // - delete(Vehicle entity): Delete a Vehicle record
    // - count(): Get total number of Vehicle records

    // Additional custom queries can be defined here as needed,
    // following Spring Data JPA method naming conventions.
}
