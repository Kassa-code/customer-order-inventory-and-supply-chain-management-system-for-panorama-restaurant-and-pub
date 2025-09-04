package com.panaromarestaurant.repository; // Define the package for the repository

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository; // Import JpaRepository for database operations
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Module; // Import the Module entity

// Defines a repository interface for the Module entity, extending JpaRepository
public interface ModuleDao extends JpaRepository<Module, Integer> { 
    // JpaRepository provides built-in CRUD operations such as:
    // - findAll(): Retrieve all Module records
    // - findById(id): Retrieve a specific Module by ID
    // - save(entity): Save or update a Module entity
    // - delete(entity): Remove a Module entity
    // - count(): Count the number of Module records

    // Custom query methods can be added here if needed, following Spring Data JPA conventions.

    // This query retrieves a list of Module entities where the given user (by
    // username)
    // DOES NOT have select privilege (privilage_select = true) for those modules.
    // It uses native SQL to join multiple tables and filter results.
    //
    // Explanation of the query:
    // 1. SELECT * FROM module as m
    // → Get all modules from the module table.
    //
    // 2. WHERE m.id NOT IN ( ... )
    // → Exclude modules that the user has select privilege for.
    //
    // 3. INNER subquery: SELECT p.module_id FROM privilage as p
    // WHERE p.privilage_select = true
    // → Find all module IDs where privilege select is enabled.
    //
    // 4. AND p.role_id IN ( ... )
    // → Only consider privileges for roles that the user has.
    //
    // 5. INNER subquery: SELECT uhr.role_id FROM user_has_role uhr
    // WHERE uhr.user_id IN ( ... )
    // → Get all roles assigned to the current user.
    //
    // 6. INNER subquery: SELECT u.id FROM user as u WHERE u.username = ?1
    // → Find the user's ID by their username.
    //
    // The combination of these conditions returns only the modules
    // that the user does NOT have select access to.

    @Query (value = "SELECT * FROM panaromarestaurant.module as m where m.id not in(SELECT p.module_id FROM panaromarestaurant.privilage as p where p.privilage_select = true and p.role_id in (SELECT uhr.role_id FROM panaromarestaurant.user_has_role uhr where uhr.user_id in (SELECT u.id FROM panaromarestaurant.user as u where u.username = ?1)));" , nativeQuery = true)
    List<Module> getModulesByUser(String username);
}
