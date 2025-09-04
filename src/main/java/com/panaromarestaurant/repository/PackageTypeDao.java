package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.PackageType;

// This interface acts as a Data Access Object (DAO) for the PackageType entity
// It inherits built-in CRUD operations from JpaRepository
public interface PackageTypeDao extends JpaRepository<PackageType, Integer> {
    // JpaRepository provides methods like save(), findById(), findAll(), deleteById(), etc.
}
