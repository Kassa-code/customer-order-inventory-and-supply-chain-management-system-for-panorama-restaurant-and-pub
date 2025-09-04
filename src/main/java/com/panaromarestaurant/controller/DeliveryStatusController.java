package com.panaromarestaurant.controller;

// Importing Spring's RestController annotation
import org.springframework.web.bind.annotation.RestController;

// Importing the DeliverStatus model class
import com.panaromarestaurant.model.DeliverStatus;

// Importing the DAO interface for DeliverStatus
import com.panaromarestaurant.repository.DeliveryStatusDao;

// Importing utility classes
import java.util.List;

// Importing dependency injection and HTTP mapping annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a REST controller to handle HTTP requests and send JSON
                // responses
public class DeliveryStatusController {

    @Autowired // Injects the DeliveryStatusDao dependency automatically by Spring
    private DeliveryStatusDao deliveryStatusDao;

    // Handles HTTP GET requests for /deliverystatus/alldata
    // Retrieves all DeliverStatus records from the database
    // Returns a List of DeliverStatus objects as JSON
    @GetMapping(value = "/deliverystatus/alldata", produces = "application/json")
    public List<DeliverStatus> findAllData() {
        // Fetch all DeliverStatus entries from the repository and return
        return deliveryStatusDao.findAll();
    }
}
