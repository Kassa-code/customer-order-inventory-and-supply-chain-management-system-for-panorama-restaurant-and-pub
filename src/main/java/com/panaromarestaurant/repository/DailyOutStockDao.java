package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.DailyOutStock;

// DailyOutStockDao interface extends JpaRepository to provide built-in CRUD operations
// JpaRepository<DailyOutStock, Integer>:
// DailyOutStock is the entity type this interface manages
// Integer is the type of the entity's primary key
// DailyOutStockDao interface handles database operations for DailyOutStock entity
// It extends JpaRepository to provide all basic CRUD methods automatically
public interface DailyOutStockDao extends JpaRepository<DailyOutStock, Integer> {

}
