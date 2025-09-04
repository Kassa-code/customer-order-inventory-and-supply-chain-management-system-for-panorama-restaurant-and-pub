package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Ingredient;

// IngredientDao interface extends JpaRepository to provide built-in CRUD operations
// JpaRepository<Ingredient, Integer>:
// Ingredient is the entity type this interface manages
// Integer is the type of the entity's primary key
// IngredientDao interface handles database operations for Ingredient entity
// It extends JpaRepository to provide all basic CRUD methods automatically
public interface IngredientDao extends JpaRepository<Ingredient, Integer> {

    // Custom JPQL query to fetch selected fields using the custom constructor in Ingredient entity
    // This improves performance by only retrieving necessary data
    // This query selects only specific fields of the Ingredient entity
    // It uses a custom constructor defined in the Ingredient model
    // This improves performance by avoiding retrieval of unnecessary data
    @Query("SELECT new Ingredient(i.id, i.itemcode, i.itemname, i.rop, i.roq, i.purchasesprice, i.salesprice, i.status_id) FROM Ingredient i ORDER BY i.id DESC")
    List<Ingredient> findAll(); // Returns a list of ingredients sorted in descending order of ID


    // This query finds an ingredient based on its item name
    // Returns the Ingredient object that matches the given item name
    @Query("select i from Ingredient i where i.itemname=?1")
    Ingredient getByItemName(String itemname);

    // This native SQL query generates the next item code (like I00001, I00002, ...)
    // Logic:
    // - Get the max current itemcode from the database (e.g., 'I00025')
    // - Remove the 'I' → becomes '00025'
    // - Convert to number and add 1 → becomes 26
    // - Pad with zeros to maintain 5 digits → '00026'
    // - Add 'I' in front → 'I00026'
    // - If no items exist, it returns the default code 'I00001'

    @Query (value="select coalesce(concat('I',lpad(substring(max(i.itemcode),2) + 1,5,0)),'I00001') from panaromarestaurant.ingredients as i;",nativeQuery = true)
    String getNextItemCode();

    // JPQL query to find ingredients not linked to a specific supplier
    // Logic:
    // - Finds all ingredients whose IDs are NOT present in the list of ingredients
    // that are associated with the given supplier ID
    // - Uses a subquery to find IDs of ingredients that are linked to the supplier
    // through the SupplierHasIngredient entity
    // - This query is used to retrieve ingredients that a supplier does not supply

    @Query("select i from Ingredient i where i.id not in (select shi.ingredients_id.id from SupplierHasIngredient shi where shi.supplier_id.id=?1)")
    List<Ingredient> getListWithoutSupply(Integer supplierid);

    // JPQL query to find ingredients linked to a specific supplier
    // Logic:

    // - Retrieves a list of ingredients whose IDs match those already associated with the given supplier ID

    // - Uses a subquery to extract ingredient IDs from the SupplierHasIngredient relationship table
    // - The subquery filters records based on the supplier ID
    // - Constructs and returns a list of Ingredient objects using a custom constructor
    //   with selected fields: id, item code, item name, unit size, and purchase price
    // - This improves performance by fetching only necessary fields
    // - Useful for populating item selection lists when managing supplier relationships

    @Query("select new Ingredient (i.id,i.itemcode,i.itemname,i.purchasesprice) from Ingredient i where i.id in (select shi.ingredients_id.id from SupplierHasIngredient shi where shi.supplier_id.id=?1)")
    List<Ingredient> getListBySupplier(Integer supplierid);

    // Custom JPQL query to retrieve active ingredients
    // - Selects specific fields (id, itemcode, itemname, purchasesprice) from the
    // Ingredient entity
    // - Filters only those ingredients where the status_id is 1 (represents 'pending' status)
    // - Uses a constructor expression to return partial Ingredient objects (only
    // selected fields)

    @Query("select new Ingredient(i.id, i.itemcode, i.itemname, i.purchasesprice) from Ingredient i where i.status_id.id = 1")
    List<Ingredient> getIngredientList();

}