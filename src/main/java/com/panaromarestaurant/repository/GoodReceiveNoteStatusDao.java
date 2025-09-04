package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.GoodReceiveNoteStatus;

// Repository interface for the GoodReceiveNoteStatus entity
// This interface provides CRUD operations and query method support for the GRN status entity
// It extends JpaRepository, specifying the entity type (GoodReceiveNoteStatus) and its primary key type (Integer)
public interface GoodReceiveNoteStatusDao extends JpaRepository<GoodReceiveNoteStatus, Integer> {

    // Spring Data JPA will automatically implement basic CRUD methods such as:
    // - findAll(): Retrieve all GoodReceiveNoteStatus records
    // - findById(Integer id): Find a specific status by ID
    // - save(GoodReceiveNoteStatus entity): Insert or update a status
    // - delete(GoodReceiveNoteStatus entity): Delete a status record
    // - count(): Return the number of status records

    // Custom query methods (if needed) can be added here using Spring Data JPA
    // method naming conventions
    // For example:
    // Optional<GoodReceiveNoteStatus> findByName(String name);
}
