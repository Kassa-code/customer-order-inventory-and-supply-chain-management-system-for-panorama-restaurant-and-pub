package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.MenuStatus; // Importing the MenuStatus entity

// DAO interface for MenuStatus entity using Spring Data JPA
public interface MenuStatusDao extends JpaRepository<MenuStatus, Integer> {

    // JpaRepository<MenuStatus, Integer>:
    // - MenuStatus: the entity class managed by this DAO
    // - Integer: the type of the primary key

    // Inherits built-in CRUD operations from JpaRepository:
    // - save(entity), findAll(), findById(id), deleteById(id), etc.

    // You can define custom query methods here if needed
}
