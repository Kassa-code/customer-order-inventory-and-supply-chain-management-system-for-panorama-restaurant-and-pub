package com.panaromarestaurant.repository;

import java.util.List;

// Importing necessary packages for data handling using JPA (Java Persistence API)
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.GoodReceiveNote;

// Interface for data access operations related to GoodReceiveNote entity
// Extends JpaRepository to inherit basic CRUD (Create, Read, Update, Delete) methods
// JpaRepository<GoodReceiveNote, Integer>:
// - GoodReceiveNote: The entity type the repository manages
// - Integer: The data type of the entity's primary key
public interface GoodReceiveNoteDao extends JpaRepository<GoodReceiveNote, Integer> {

    // Custom native SQL query to generate the next GRN code
    // Format: GRN000001, GRN000002, ...
    // Logic:
    // 1. Get the max existing code, remove the prefix "GRN", convert to integer,
    // add 1.
    // 2. Pad it to 6 digits and re-attach "GRN" prefix.
    // 3. If no code exists, default to "GRN00001".
    @Query(value = "SELECT coalesce(concat('GRN', lpad(substring(max(grn.code),4) + 1,5,0)), 'GRN00001') FROM panaromarestaurant.grn as grn ;", nativeQuery = true)
    String getNextOrderCode();

    // Custom JPQL query to retrieve a list of GRNs for a specific supplier
    // Criteria:
    // - The GRN's supplier ID matches the given parameter
    // - The net amount is not equal to the paid amount (i.e., payment is pending)
    @Query(value = "SELECT g FROM GoodReceiveNote g where g.supplier_id.id=?1 and g.net_amount <> g.paid_amount")
    List<GoodReceiveNote> getGrnListBySupplier(Integer supplierId);

    // Native SQL query to fetch all records from the 'grn' table (Good Receive
    // Note)
    // where the supplier_id matches the given parameter and the grn_status_id is
    // not equal to 3.
    // This query filters for GRNs of a specific supplier that do not have a status
    // of 3
    // (likely representing a completed or finalized status).
    @Query(value = "SELECT * FROM grn g WHERE g.supplier_id = ?1 AND g.grn_status_id <> 3;", nativeQuery = true)
    // Method to retrieve a list of GoodReceiveNote entities matching the criteria.
    // Parameter 'supplierid' is used to specify the supplier whose GRNs we want to
    // fetch.
    List<GoodReceiveNote> getGrnListBySupplierIncompletePaymentStatus(Integer supplierid);

}
