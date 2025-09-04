package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.SupplierPayment;

// SupplierPaymentDao is a Spring Data JPA repository interface for the SupplierPayment entity.

// It extends JpaRepository, which provides standard CRUD operations such as:
// save(), findById(), findAll(), deleteById(), count(), and more.

// The first generic parameter <SupplierPayment> is the entity class that this repository manages.
// The second parameter <Integer> is the type of the entity's primary key.

// This interface enables interaction with the database table mapped to SupplierPayment
// without requiring implementation for basic operations.
public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer> {

    @Query(value = "SELECT coalesce(concat('SUP', lpad(substring(max(sup.bill_no),4) + 1,5,0)), 'SUP00001') FROM panaromarestaurant.supplierpayment as sup ;", nativeQuery = true)
    String getNextOrderCode();

    
}
