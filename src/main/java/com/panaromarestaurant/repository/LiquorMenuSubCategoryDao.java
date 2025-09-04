package com.panaromarestaurant.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.panaromarestaurant.model.LiquorMenuSubCategory;

public interface LiquorMenuSubCategoryDao extends JpaRepository<LiquorMenuSubCategory, Integer> {

    // Returns subcategories filtered by category ID
    @Query("SELECT lsc FROM LiquorMenuSubCategory lsc WHERE lsc.liquormenu_category_id.id = ?1")
    List<LiquorMenuSubCategory> byCategory(Integer categoryid);

    // JpaRepository provides built-in methods: save, findById, findAll, deleteById,
    // etc.
}
