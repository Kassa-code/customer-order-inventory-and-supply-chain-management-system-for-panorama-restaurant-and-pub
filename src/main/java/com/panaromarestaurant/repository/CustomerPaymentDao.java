package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.panaromarestaurant.model.CustomerPayment;

// CustomerPaymentDao is a Spring Data JPA repository interface for the CustomerPayment entity.
// It allows interaction with the "payment" table without needing to manually implement CRUD operations.

public interface CustomerPaymentDao extends JpaRepository<CustomerPayment, Integer> {

    // Custom native SQL query to generate the next bill number in the format
    // "CUS00001", "CUS00002", etc.
    // It:
    // - Extracts the numeric part of the latest bill number using SUBSTRING
    // - Increments it by 1
    // - Pads it with leading zeros to ensure a 5-digit number
    // - Adds the "CUS" prefix
    // - Defaults to "CUS00001" if there are no existing records
    @Query(value = "SELECT coalesce(concat('CUS', lpad(substring(max(p.bill_no),4) + 1,5,0)), 'CUS00001') FROM panaromarestaurant.payment as p;", nativeQuery = true)
    String getNextOrderCode();
}
