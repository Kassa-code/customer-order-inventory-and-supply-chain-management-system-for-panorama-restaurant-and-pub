package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panaromarestaurant.model.SubMennuSubCategoryType;

// This interface acts as the Data Access Object (DAO) for the SubMennuSubCategoryType entity.
// It enables interaction with the database using Spring Data JPA by extending JpaRepository.
public interface SubMenuSubCategoryTypeDao extends JpaRepository<SubMennuSubCategoryType, Integer> {

    

    // JpaRepository<SubMennuSubCategoryType, Integer>:
    // - SubMennuSubCategoryType is the entity this repository handles.
    // - Integer is the type of the entity's primary key.

    // Inherited CRUD methods include:
    // - save(entity): to insert or update an entity
    // - findById(id): to retrieve a single entity by its ID
    // - findAll(): to retrieve all entities
    // - deleteById(id): to delete an entity by ID
    // - count(): to get the total number of records
    // - existsById(id): to check if a record exists by ID

    // Additional custom query methods can be defined here using method name
    // conventions or @Query annotations.
}
