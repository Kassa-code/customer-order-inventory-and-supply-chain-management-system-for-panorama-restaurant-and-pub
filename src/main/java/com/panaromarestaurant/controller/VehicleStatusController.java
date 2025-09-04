package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.VehicleStatus;
import com.panaromarestaurant.repository.VehicleStatusDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a REST controller to handle HTTP requests and send JSON responses
public class VehicleStatusController {

    @Autowired // Injects the VehicleStatusDao dependency automatically by Spring
    private VehicleStatusDao vehicleStatusDao;

    // Handles HTTP GET requests for /vehiclestatus/alldata
    // Retrieves all VehicleStatus records from the database
    // Returns a List of VehicleStatus objects as JSON
    @GetMapping(value = "/vehiclestatus/alldata", produces = "application/json")
    public List<VehicleStatus> findAllData() {
        // Fetch all VehicleStatus entries from the repository and return
        return vehicleStatusDao.findAll();
    }
}
