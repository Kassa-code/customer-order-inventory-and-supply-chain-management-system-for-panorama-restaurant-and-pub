
package com.panaromarestaurant.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.PurchaseOrderStatus;

// Repository interface for the PurchaseOrderStatus entity
// Extends JpaRepository to provide basic CRUD operations and query methods
public interface PurchaseOrderStatusDao extends JpaRepository<PurchaseOrderStatus, Integer> {

    // The JpaRepository interface provides several methods out of the box,
    // including:
    // - findAll(): Retrieve all entities from the database
    // - findById(id): Fetch a specific entity based on its ID
    // - save(entity): Persist a new entity or update an existing one
    // - delete(entity): Delete a specific entity
    // - count(): Get the total number of entities

    // Additional custom query methods can be defined here as needed
    // Methods follow the naming conventions provided by Spring Data JPA
}
