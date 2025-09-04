package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.IngredientSubCategory;

// This interface acts as a Data Access Object (DAO) for IngredientSubCategory
// It extends JpaRepository to automatically provide basic database operations
public interface IngredientSubCategoryDao extends JpaRepository<IngredientSubCategory, Integer> {
    // No need to write any method here unless you need custom queries
    // JpaRepository gives you methods like save(), findById(), findAll(),
    // deleteById(), etc.

    // Custom JPA query to retrieve all ingredient subcategories that belong to a
    // specific category, using a dynamic category ID passed as a method parameter
    @Query("SELECT sc FROM IngredientSubCategory sc WHERE sc.ingredient_category_id.id = ?1")
    public List<IngredientSubCategory> byCategory(Integer categoryid); // Method takes a category ID and returns matching subcategories

    // Custom JPQL query to fetch a specific IngredientSubCategory based on its name
    // and category ID
    @Query("SELECT sc FROM IngredientSubCategory sc WHERE sc.name=?1 and sc.ingredient_category_id.id = ?2")
    // Method to retrieve an IngredientSubCategory by its name and the ID of its
    // parent category
    public IngredientSubCategory getNameByCategory(String name, Integer id);

    // Explanation of the query:

    // @Query annotation is used to define a custom JPQL (Java Persistence Query
    // Language) query.
    // The query is written in JPQL, which is similar to SQL but works with Java
    // entities instead of tables.

    // "SELECT sc" - This part of the query selects (or retrieves) the "sc" alias,
    // which represents an instance of the "IngredientSubCategory" entity.
    // This means we're fetching records of IngredientSubCategory from the database.

    // "FROM IngredientSubCategory sc" - This specifies the source of the data. We
    // are selecting from the "IngredientSubCategory" entity.
    // "sc" is just an alias for the "IngredientSubCategory" entity, used for
    // referencing it in the query.
    // You can think of "sc" as a placeholder for each row returned from the
    // "IngredientSubCategory" table.

    // "WHERE sc.ingredientCategory.id = ?1" - This is the condition that filters the
    // data we want to retrieve.
    // It means that we want to fetch "IngredientSubCategory" records where the
    // "ingredientCategory" (which is a relationship with another entity) has an "id"
    // that matches the value provided as the first method parameter.
    // - `sc.ingredientCategory` refers to the related entity "IngredientCategory"
    // associated with each "IngredientSubCategory".
    // - `.id` accesses the "id" field of the "IngredientCategory" entity.
    // - `= ?1` uses a positional parameter. It will match whatever value is passed
    // into the method's argument.

    // In simple terms: This query retrieves all "IngredientSubCategory" records
    // that are associated with an "IngredientCategory" whose ID matches the given
    // parameter.
}
