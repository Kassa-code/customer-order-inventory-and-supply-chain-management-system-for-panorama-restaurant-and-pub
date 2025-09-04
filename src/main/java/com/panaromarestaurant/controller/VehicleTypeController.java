package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.VehicleType;
import com.panaromarestaurant.repository.VehicleTypeDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller, making it ready to handle HTTP requests
public class VehicleTypeController {

    @Autowired // Automatically injects an instance of VehicleTypeDao (dependency injection)
    private VehicleTypeDao vehicleTypeDao; // Data Access Object for VehicleType entities

    // Handles HTTP GET requests to the endpoint "/vehicletype/alldata"
    // This method produces a JSON response containing all VehicleType records from the database
    @GetMapping(value = "/vehicletype/alldata", produces = "application/json")
    public List<VehicleType> findAllData() {
        // Calls the JpaRepository method to fetch all VehicleType entities and returns them
        return vehicleTypeDao.findAll();
    }
}
