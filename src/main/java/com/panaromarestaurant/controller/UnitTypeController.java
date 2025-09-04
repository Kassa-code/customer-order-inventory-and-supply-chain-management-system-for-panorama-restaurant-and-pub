package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.UnitType;
import com.panaromarestaurant.repository.UnitTypeDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller
public class UnitTypeController {

    @Autowired // Spring will inject an instance of UnitTypeDao here
    private UnitTypeDao unitTypeDao; // DAO for accessing UnitType data

    // Handle GET requests to "/unittype/alldata"
    // Fetch all unit type records as a JSON response [URL → /unittype/alldata]
    @GetMapping(value = "/unittype/alldata", produces = "application/json")
    public List<UnitType> findAllData() {
        return unitTypeDao.findAll(); // Return all unit type entries from the database
    }
}
