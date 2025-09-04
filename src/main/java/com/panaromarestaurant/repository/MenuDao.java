package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Menu;

// MenuDao interface handles database operations for Menu entity
// Extends JpaRepository to inherit basic CRUD and pagination functionality
// JpaRepository<Menu, Integer>:
// - Menu is the entity type managed
// - Integer is the type of the primary key
public interface MenuDao extends JpaRepository<Menu, Integer> {

    // Custom JPQL query to retrieve a Menu entity by its name
    // ?1 refers to the first method parameter (String name)
    @Query("select m from Menu m where m.name = ?1")
    Menu getByName(String name); // Returns a LiquorMenu object based on the Menu name (possible type mismatch)

    @Query(value = "SELECT * FROM panaromarestaurant.menu as m where m.menu_status_id = 1 order by m.id desc;", nativeQuery = true)
    List<Menu> getAvailableMenus();
}
