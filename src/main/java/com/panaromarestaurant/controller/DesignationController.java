package com.panaromarestaurant.controller; // Define the package for the controller

import org.springframework.web.bind.annotation.RestController; // Import annotation to define a REST controller
import com.panaromarestaurant.model.Designation; // Import the Designation model
import com.panaromarestaurant.repository.DesignationDao; // Import the Designation DAO for database access

import java.util.List; // Import List to handle collections

import org.springframework.beans.factory.annotation.Autowired; // Import Autowired for dependency injection
import org.springframework.web.bind.annotation.GetMapping; // Import GetMapping to handle HTTP GET requests

@RestController // Mark this class as a REST controller to handle HTTP requests
public class DesignationController {

    @Autowired // Inject the DesignationDao dependency automatically
    private DesignationDao designationDao;

    // Endpoint to retrieve all designation data
    // URL: [/designation/alldata]
    @GetMapping(value = "/designation/alldata", produces = "application/json") 
    public List<Designation> findAllData() {
        return designationDao.findAll(); // Fetch all records from the database and return as JSON
    }
    
}
