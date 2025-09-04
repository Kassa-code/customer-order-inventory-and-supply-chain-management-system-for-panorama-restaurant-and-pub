package com.panaromarestaurant.repository;

import java.util.List;

// Importing necessary packages for data handling using JPA (Java Persistence API)
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.PurchaseOrder;

// Interface for data access operations related to PurchaseOrder entity
// Extends JpaRepository to inherit basic CRUD (Create, Read, Update, Delete) methods
// JpaRepository<PurchaseOrder, Integer>:
// - PurchaseOrder: The entity type the repository manages
// - Integer: The data type of the entity's primary key
public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer> {

    // Custom query to generate the next order code for a supplier purchase order
    // The query uses SQL syntax to get the next order code in a sequential format:
    // 1. Uses COALESCE to handle the case when there are no existing order codes
    // (initial case).
    // 2. CONCAT and LPAD functions are used to format the new code as follows:
    // - 'SPO' as the prefix.
    // - Extracts the numeric part from the existing maximum order code.
    // - Increments the numeric part by 1.
    // - Pads the new number with zeros to ensure a fixed length of 6.
    // - Example: If the last order code is 'SPO00010', the next will be 'SPO00011'.
    // - If no codes exist, it returns the initial value 'SPO00001'.
    // The query fetches data from the "supplierpurchaseorder" table in the
    // "panaromarestaurant" schema.
    @Query(value = "SELECT coalesce(concat('SPO', lpad(substring(max(spo.order_code),4) + 1,5,0)), 'SPO00001') FROM panaromarestaurant.supplierpurchaseorder as spo ;", nativeQuery = true)
    String getNextOrderCode();

    // Custom native SQL query to retrieve all purchase orders for a specific
    // supplier
    // where the purchase order status is active (status_id = 1).
    @Query(value = "SELECT * FROM supplierpurchaseorder WHERE supplier_id = ?1 AND supplierpurchaseorder_status_id = 1", nativeQuery = true)
    List<PurchaseOrder> getPurchaseOrderListBySupplier(Integer supplierid);

}
