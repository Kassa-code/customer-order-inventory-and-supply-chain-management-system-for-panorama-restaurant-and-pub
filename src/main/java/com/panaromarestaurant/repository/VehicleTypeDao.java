package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.VehicleType;

// This interface acts as a Data Access Object (DAO) for the VehicleType entity
// It extends JpaRepository to inherit standard CRUD operations for VehicleType
// JpaRepository<T, ID> requires the entity type and the type of its primary key
public interface VehicleTypeDao extends JpaRepository<VehicleType, Integer> {
    // By extending JpaRepository, this interface automatically gets methods like:
    // save() - to insert or update a VehicleType
    // findById() - to retrieve a VehicleType by its id
    // findAll() - to get all VehicleType records
    // deleteById() - to delete a VehicleType by id
    // No additional methods are defined here but custom query methods can be added
    // if needed
}
