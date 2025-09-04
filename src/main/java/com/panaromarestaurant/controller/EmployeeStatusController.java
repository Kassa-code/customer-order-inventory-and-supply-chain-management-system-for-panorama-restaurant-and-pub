package com.panaromarestaurant.controller; // Define the package for the controller

import org.springframework.web.bind.annotation.RestController; // Import annotation to define a REST controller
import com.panaromarestaurant.model.EmployeeStatus; // Import the EmployeeStatus model
import com.panaromarestaurant.repository.EmployeeStatusDao; // Import the repository for database operations

import java.util.List; // Import List to handle collections

import org.springframework.beans.factory.annotation.Autowired; // Import Autowired for dependency injection
import org.springframework.web.bind.annotation.GetMapping; // Import GetMapping to handle HTTP GET requests

@RestController // Mark this class as a REST controller to handle HTTP requests
public class EmployeeStatusController {

    @Autowired // Inject the EmployeeStatusDao dependency automatically
    private EmployeeStatusDao employeeStatusDao;

    // Endpoint to retrieve all employee status data
    // URL: [/employeestatus/alldata]
    @GetMapping(value = "/employeestatus/alldata", produces = "application/json") 
    public List<EmployeeStatus> findAllData() {
        return employeeStatusDao.findAll(); // Fetch all records from the database and return as JSON
    }
    
}
