package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Inventory;

// This interface acts as the Data Access Object (DAO) for the Inventory entity
// It extends JpaRepository to inherit basic CRUD methods (save, findById, delete, etc.)
public interface InventoryDao extends JpaRepository<Inventory, Integer> {

    // This query generates the next batch number
    // It finds the maximum existing batch number starting with 'BNO', increments it
    // by 1,
    // and formats it back as a 4-digit padded string prefixed with 'BNO'
    // If no batch numbers are found, it returns 'BNO0001' as the starting value
    @Query(value = "SELECT coalesce(concat('BNO', lpad(substring(max(inv.batch_number),4)+1,4,0)),'BNO0001') FROM panaromarestaurant.inventory inv WHERE inv.batch_number LIKE 'BNO%';", nativeQuery = true)
    String getNextBatchNo();

    // This query retrieves an Inventory record based on a given ingredient ID and
    // batch number
    // It is used to check if a batch already exists in the inventory for a specific
    // ingredient
    @Query(value = "SELECT * FROM panaromarestaurant.inventory AS inv WHERE inv.ingredients_id = ?1 AND inv.batch_number = ?2", nativeQuery = true)
    Inventory getByIngredientBatchNumber(Integer id, String batchno);


    // Custom native query to fetch inventory records for a specific ingredient
    // Filters results where:
    // - ingredient ID matches the given parameter (?1)
    // - available quantity is greater than zero (available_qty > 0)
    // - expire date is after the current date (not expired)
    // Returns a list of Inventory objects that meet these criteria
    @Query(value = "SELECT * FROM panaromarestaurant.inventory AS inv WHERE inv.ingredients_id=?1 and inv.available_qty>0 and inv.expire_date>current_date() order by inv.expire_date;", nativeQuery = true)
    List<Inventory> getByIngredient(Integer ingredients_id);

}
