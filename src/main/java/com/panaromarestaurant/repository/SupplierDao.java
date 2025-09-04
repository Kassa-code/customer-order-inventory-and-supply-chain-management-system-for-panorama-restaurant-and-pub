package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Supplier;

// SupplierDao is a repository interface for performing CRUD operations on Supplier entities
// It extends JpaRepository, which provides built-in methods like save, findAll, findById, deleteById, etc.
// The generic parameters specify that it works with Supplier entities and uses Integer as the ID type
public interface SupplierDao extends JpaRepository<Supplier, Integer> {

    // Custom native SQL query to generate the next supplier code
    @Query(value = "SELECT LPAD(MAX(s.sup_no) + 1, 8, '0') FROM panaromarestaurant.supplier AS s;", nativeQuery = true)
    // This method returns the next available supplier number as an 8-digit,
    // zero-padded string.
    // Example: if the current maximum is '00000123', the result will be '00000124'.
    // LPAD: left-pads the number with zeros to ensure it has exactly 8 digits.
    // MAX(s.sup_no): gets the highest existing supplier number in the table.
    // +1: increments it to create the next number in sequence.
    String getNextOrderCode();

}
