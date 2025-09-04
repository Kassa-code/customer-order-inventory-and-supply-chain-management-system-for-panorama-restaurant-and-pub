package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.LiquorMenu;

// LiquorMenuDao interface extends JpaRepository to provide built-in CRUD operations
// JpaRepository<LiquorMenu, Integer>:
// LiquorMenu is the entity type this interface manages
// Integer is the type of the entity's primary key
// LiquorMenuDao interface handles database operations for LiquorMenu entity
// It extends JpaRepository to provide all basic CRUD methods automatically
public interface LiquorMenuDao extends JpaRepository<LiquorMenu, Integer> {

    // Custom JPA query to retrieve a LiquorMenu entity by its exact name
    // The method uses a JPQL (Java Persistence Query Language) statement to fetch
    // the matching record
    @Query("select lm from LiquorMenu lm where lm.name = ?1")
    LiquorMenu getByName(String name);

    @Query(value = "SELECT * FROM panaromarestaurant.liquormenu as lm where lm.liquormenu_status_id = 1 order by lm.id desc;", nativeQuery = true)
    List<LiquorMenu> getAvailableLiquorMenus();
}
