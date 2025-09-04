package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.OrderType;

// DAO for OrderType entity using Spring Data JPA
public interface OrderTypeDao extends JpaRepository<OrderType, Integer> {

    // JpaRepository<OrderType, Integer>:
    // - OrderType: entity managed by this DAO
    // - Integer: primary key type

    // Inherits built-in CRUD methods:
    // - save(), findById(), findAll(), deleteById(), count(), existsById()

    // Custom query methods can also be added here
}
