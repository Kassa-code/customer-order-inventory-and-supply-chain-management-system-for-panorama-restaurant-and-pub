package com.panaromarestaurant.repository; 

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.IngredientCategory; 

// This interface acts as a Data Access Object (DAO) for IngredientCategory
// It inherits built-in CRUD operations from JpaRepository
public interface IngredientCategoryDao extends JpaRepository<IngredientCategory, Integer>  {

    // Custom JPQL query to find an IngredientCategory by its name
    @Query("SELECT ic FROM IngredientCategory ic WHERE ic.name=?1")
    // Method to return an IngredientCategory entity matching the provided name
    IngredientCategory getNameByName(String name);

    // JpaRepository provides basic CRUD methods like save(), findAll(), deleteById(), etc.
}
