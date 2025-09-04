package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Delivery;

// DAO interface for DineInTable entity using Spring Data JPA
public interface DeliveryDao extends JpaRepository<Delivery, Integer> {

     @Query(value = "SELECT coalesce(concat('DVO', lpad(substring(max(d.code),4) + 1,5,0)), 'DVO00001') FROM panaromarestaurant.delivery as d ;", nativeQuery = true)
      String getNextOrderCode();

    // JpaRepository<DineInTable, Integer>:
    // - DineInTable: the entity class managed by this DAO
    // - Integer: the type of the primary key (id field in DineInTable)

    // Inherits built-in CRUD operations from JpaRepository:
    // - save(entity): insert or update a record
    // - findAll(): retrieve all records
    // - findById(id): fetch a record by its ID
    // - deleteById(id): delete a record by ID
    // - and more
}
