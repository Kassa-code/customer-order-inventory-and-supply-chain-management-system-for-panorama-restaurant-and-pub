package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.OrderStatus;
import com.panaromarestaurant.repository.OrderStatusDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller that handles HTTP requests and returns JSON responses
public class OrderStatusController {

    @Autowired // Injects the OrderStatusDao bean for database operations
    private OrderStatusDao orderStatusDao; // Repository for CRUD operations on OrderStatus entity

    // Handles GET requests to the endpoint /orderstatus/alldata
    // Returns a JSON list of all OrderStatus records from the database
    @GetMapping(value = "/orderstatus/alldata", produces = "application/json")
    public List<OrderStatus> findAllData() {
        return orderStatusDao.findAll(); // Fetches all OrderStatus entries
    }
}
