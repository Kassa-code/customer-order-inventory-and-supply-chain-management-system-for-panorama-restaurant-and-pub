package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.SubMenuSubCategory;

// This interface serves as the Data Access Object (DAO) for the SubMenuSubCategory entity.
// By extending JpaRepository, it inherits many ready-to-use database operation methods,
// such as saving, finding, updating, and deleting SubMenuSubCategory records.
public interface SubMenuSubCategoryDao extends JpaRepository<SubMenuSubCategory, Integer> {


    // Custom JPA query to retrieve all ingredient subcategories that belong to a
    // specific category, using a dynamic category ID passed as a method parameter
    @Query("SELECT ssc FROM SubMenuSubCategory ssc WHERE ssc.submenu_category_id.id = ?1")
    List<SubMenuSubCategory> byCategory(Integer categoryid);

    // JpaRepository<SubMenuSubCategory, Integer> parameters:
    // - SubMenuSubCategory: the entity type this repository manages
    // - Integer: the type of the entity's primary key

    // Common inherited CRUD methods include:
    // - save(entity): to create or update an entity
    // - findById(id): to retrieve an entity by its ID
    // - findAll(): to fetch all entities of this type
    // - deleteById(id): to remove an entity by its ID

    // Additional custom queries can be added here using Spring Data JPA's method
    // naming conventions or @Query annotations.
}
