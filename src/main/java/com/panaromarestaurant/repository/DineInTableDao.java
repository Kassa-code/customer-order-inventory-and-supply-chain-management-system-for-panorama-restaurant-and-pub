package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.DineInTable;

// DAO interface for DineInTable entity using Spring Data JPA
public interface DineInTableDao extends JpaRepository<DineInTable, Integer> {

    // JpaRepository<DineInTable, Integer>:
    // - DineInTable: the entity class managed by this DAO
    // - Integer: the type of the primary key (id field in DineInTable)

    // Inherits built-in CRUD operations from JpaRepository:
    // - save(entity): insert or update a record
    // - findAll(): retrieve all records
    // - findById(id): fetch a record by its ID
    // - deleteById(id): delete a record by ID
    // - and more

    // ---------------- Custom Queries ----------------

    // Custom native SQL query to list available dine-in tables
    // Logic:
    // - Selects tables that are marked with status ID = 1 (e.g., "Available")
    // - Excludes tables that already have an order for today with status 1, 2, or 3
    // (e.g., New, In Progress, or Reserved)
    @Query(value = "SELECT * FROM panaromarestaurant.dinein_table as dt WHERE dt.dinein_table_status_id = 1 AND dt.id NOT IN (SELECT op.dinein_table_id FROM panaromarestaurant.order_process as op WHERE op.date = CURRENT_DATE() and op.order_type_id=1 AND (op.order_status_id = 1 OR op.order_status_id = 2 OR op.order_status_id = 3));", nativeQuery = true)
    List<DineInTable> listByAvailable(); // Returns the list of currently available tables
}
