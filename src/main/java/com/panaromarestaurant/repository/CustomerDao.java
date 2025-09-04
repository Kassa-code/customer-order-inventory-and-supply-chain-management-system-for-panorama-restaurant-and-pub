package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Customer;

// DAO interface for Customer entity using Spring Data JPA
public interface CustomerDao extends JpaRepository<Customer, Integer> {

    // JpaRepository<Customer, Integer>:
    // - Customer: the entity managed by this DAO
    // - Integer: the type of the entity's primary key

    // Inherits built-in CRUD methods:
    // - save(), findById(), findAll(), deleteById(), count(), existsById()

    // Custom query to find a Customer by their contact number (mobile number)
    @Query("SELECT c FROM Customer c WHERE c.contactno = ?1")
    Customer getByMobile(String contactno);
}
