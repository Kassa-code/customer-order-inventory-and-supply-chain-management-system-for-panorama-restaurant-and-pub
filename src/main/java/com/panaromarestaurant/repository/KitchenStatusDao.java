package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panaromarestaurant.model.KitchenStatus;

// DAO interface for KitchenStatus entity using Spring Data JPA
public interface KitchenStatusDao extends JpaRepository<KitchenStatus, Integer> {

    // JpaRepository<KitchenStatus, Integer>:
    // - KitchenStatus: the entity class managed by this DAO
    // - Integer: the type of the primary key

    // Inherits built-in CRUD operations from JpaRepository:
    // - save(entity), findAll(), findById(id), deleteById(id), etc.

    // Custom query methods can be added here if needed
}
