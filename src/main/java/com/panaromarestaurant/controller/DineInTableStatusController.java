package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.DineInTableStatus;
import com.panaromarestaurant.repository.DineInTableStatusDao;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller that handles HTTP requests and returns JSON responses
public class DineInTableStatusController {

    @Autowired // Injects the DineInTableStatusDao bean for database operations
    private DineInTableStatusDao dineInTableStatusDao; // Repository for CRUD operations on DineInTableStatus entity

    // Handles GET requests to the endpoint /dineintablestatus/alldata
    // Returns a JSON list of all DineInTableStatus records from the database
    @GetMapping(value = "/dineintablestatus/alldata", produces = "application/json")
    public List<DineInTableStatus> findAllData() {
        return dineInTableStatusDao.findAll(); // Fetches all DineInTableStatus entries
    }
}
