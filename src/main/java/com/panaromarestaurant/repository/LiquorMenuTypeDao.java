package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.LiquorMenuType;

// DAO for LiquorMenuType entity using Spring Data JPA
public interface LiquorMenuTypeDao extends JpaRepository<LiquorMenuType, Integer> {

    // JpaRepository<LiquorMenuType, Integer>:
    // - LiquorMenuType: entity managed by this DAO
    // - Integer: primary key type

    // Inherits built-in CRUD methods:
    // - save(), findById(), findAll(), deleteById(), count(), existsById()

    // Custom query methods can also be added here
}
