package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.PackageType;
import com.panaromarestaurant.repository.PackageTypeDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller
public class PackageTypeController {

    @Autowired // Spring will inject an instance of PackageTypeDao here
    private PackageTypeDao packageTypeDao; // DAO for accessing PackageType data

    // Handle GET requests to "/packagetype/alldata"
    // Fetch all package type records as a JSON response [URL → /packagetype/alldata]
    @GetMapping(value = "/packagetype/alldata", produces = "application/json")
    public List<PackageType> findAllData() {
        return packageTypeDao.findAll(); // Return all package type entries from the database
    }
}
