package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.UnitType;

// This interface acts as a Data Access Object (DAO) for the UnitType entity
// It inherits built-in CRUD operations from JpaRepository
public interface UnitTypeDao extends JpaRepository<UnitType, Integer> {
    // JpaRepository provides methods like save(), findById(), findAll(), deleteById(), etc.
}
