package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Brand;

// This interface acts as a Data Access Object (DAO) for the Brand entity
// It inherits built-in CRUD operations from JpaRepository
public interface BrandDao extends JpaRepository<Brand, Integer> {
    // JpaRepository provides methods like save(), findById(), findAll(), deleteById(), etc.

    // Custom query to get all Brand records that are linked to a specific Ingredient Category
    // The query uses JPQL (Java Persistence Query Language)
    // It selects all brands (`b`) whose ID exists in the subquery
    // The subquery selects brand IDs from BrandHasCategory where the category ID matches the given parameter
    // This ensures we get only brands that are associated with the specified ingredient category

    // How to take two ids from association bran_has_category brand_id.id || category_id.id
    @Query(value = "SELECT b FROM Brand b WHERE b.id IN (SELECT bhc.brand_id.id FROM BrandHasCategory bhc WHERE bhc.ingredient_category_id.id=?1)")
    public List<Brand> byCategory(Integer categoryid); // Method to execute the above query

    // Custom query method to retrieve a Brand entity by its name
    @Query("SELECT b FROM Brand b WHERE b.name=?1")
    public Brand getNameByBrand(String name);

}
