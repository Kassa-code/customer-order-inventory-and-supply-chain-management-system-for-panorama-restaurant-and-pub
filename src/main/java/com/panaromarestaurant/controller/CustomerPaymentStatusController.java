package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.CustomerPaymentStatus;
import com.panaromarestaurant.repository.CustomerPaymentStatusDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a REST controller to handle HTTP requests and return JSON responses
public class CustomerPaymentStatusController {

    @Autowired // Injects an instance of CustomerPaymentStatusDao into this controller
    private CustomerPaymentStatusDao customerPaymentStatusDao;

    // Handles GET requests to "/customerpaymentstatus/alldata"
    // Fetches all CustomerPaymentStatus records from the database
    // Returns the list as JSON, typically for use in frontend dropdowns or selections
    @GetMapping(value = "/customerpaymentstatus/alldata", produces = "application/json")
    public List<CustomerPaymentStatus> findAllData() {
        return customerPaymentStatusDao.findAll(); // Returns all records from the payment_status table
    }
}
