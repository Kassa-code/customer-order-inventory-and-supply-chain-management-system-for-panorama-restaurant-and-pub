package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.LiquorMenuStatus;

// DAO interface for LiquorMenuStatus entity using Spring Data JPA
public interface LiquorMenuStatusDao extends JpaRepository<LiquorMenuStatus, Integer> {

    // JpaRepository<LiquorMenuStatus, Integer>:
    // - LiquorMenuStatus: entity managed by this DAO
    // - Integer: primary key type

    // Inherits default CRUD methods:
    // - save(), findAll(), findById(), deleteById(), etc.

    // Custom query methods can be defined here if needed
}
