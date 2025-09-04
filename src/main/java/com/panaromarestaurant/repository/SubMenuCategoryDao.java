package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panaromarestaurant.model.SubMenuCategory;

// This interface serves as the Data Access Object (DAO) for the SubMenuCategory entity.
// It extends JpaRepository, which provides a variety of prebuilt methods to perform
// CRUD operations and pagination without needing explicit method definitions.
public interface SubMenuCategoryDao extends JpaRepository<SubMenuCategory, Integer> {

    // JpaRepository<SubMenuCategory, Integer>:
    // - SubMenuCategory: The entity type this repository manages.
    // - Integer: The data type of the entity's primary key.

    // Common inherited methods include:
    // - save(SubMenuCategory entity): Inserts or updates a record.
    // - findById(Integer id): Retrieves an entity by its primary key.
    // - findAll(): Returns all entities in the table.
    // - deleteById(Integer id): Deletes an entity based on its primary key.
    // - count(): Returns the total number of entities.
    // - existsById(Integer id): Checks if an entity exists with the given primary
    // key.

    // You can define additional custom queries here if needed, using method naming
    // conventions or @Query annotations.
}
