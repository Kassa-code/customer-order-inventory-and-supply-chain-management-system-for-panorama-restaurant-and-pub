package com.panaromarestaurant.repository; 


import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.IngredientStatus; 

// This interface acts as a Data Access Object (DAO) for the IngredientStatus entity
// It extends JpaRepository, which provides built-in CRUD operations like save(), findById(), findAll(), deleteById(), etc.
public interface IngredientStatusDao extends JpaRepository<IngredientStatus, Integer> {
    // JpaRepository provides methods for common database operations without requiring custom queries.
    // For example: save(), findById(), findAll(), deleteById(), etc.
}
