package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panaromarestaurant.model.GarbageRemove;

// This interface acts as the Data Access Object (DAO) for the GarbageRemove entity.
// It extends JpaRepository, providing access to basic CRUD operations such as:
// - save()
// - findAll()
// - findById()
// - deleteById()
// - existsById(), count(), etc.
// This makes it easier to perform database interactions without writing SQL manually.

public interface GarbageRemoveDao extends JpaRepository<GarbageRemove, Integer> {

    // You can define custom queries here using method names or @Query annotations
    // For example:
    // List<GarbageRemove> findByReason(String reason);

    // No custom methods currently defined, but JpaRepository provides all essential
    // DB operations.
}
