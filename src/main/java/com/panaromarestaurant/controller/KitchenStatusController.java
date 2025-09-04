package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.KitchenStatus;
import com.panaromarestaurant.repository.KitchenStatusDao;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller that handles HTTP requests and returns JSON responses
public class KitchenStatusController {

    @Autowired // Injects the KitchenStatusDao bean for database operations
    private KitchenStatusDao kitchenStatusDao; // Repository for CRUD operations on KitchenStatus entity

    // Handles GET requests to the endpoint /kitchenstatus/alldata
    // Returns a JSON list of all KitchenStatus records from the database
    @GetMapping(value = "/kitchenstatus/alldata", produces = "application/json")
    public List<KitchenStatus> findAllData() {
        return kitchenStatusDao.findAll(); // Fetches all KitchenStatus entries
    }
}
