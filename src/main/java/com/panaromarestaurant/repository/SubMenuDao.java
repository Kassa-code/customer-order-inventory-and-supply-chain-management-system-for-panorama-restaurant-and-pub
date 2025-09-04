package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.SubMenu;

// IngredientDao interface extends JpaRepository to provide built-in CRUD operations
// JpaRepository<Ingredient, Integer>:
// Ingredient is the entity type this interface manages
// Integer is the type of the entity's primary key
// IngredientDao interface handles database operations for Ingredient entity
// It extends JpaRepository to provide all basic CRUD methods automatically
public interface SubMenuDao extends JpaRepository<SubMenu, Integer> {

    // Custom JPA query to retrieve a SubMenu entity by its exact name
    // The method uses a JPQL (Java Persistence Query Language) statement to fetch
    // the matching record
    @Query("select s from SubMenu s where s.name = ?1")
    SubMenu getByName(String name);

     @Query (value = "SELECT * FROM panaromarestaurant.submenu as s where s.submenu_status_id = 1 order by s.id desc;",nativeQuery = true)
    List<SubMenu> getAvailableMenus();

}