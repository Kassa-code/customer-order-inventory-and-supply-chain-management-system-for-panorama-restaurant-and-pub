package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.LiquorMenuCategory;

// DAO interface for LiquorMenuCategory entity using Spring Data JPA
public interface LiquorMenuCategoryDao extends JpaRepository<LiquorMenuCategory, Integer> {

    // JpaRepository<LiquorMenuCategory, Integer>:
    // - LiquorMenuCategory: Entity class this DAO handles
    // - Integer: Type of the entity's primary key

    // Inherits default methods:
    // - save(), findAll(), findById(), deleteById(), etc.

    // Custom queries can be added here if needed
}
