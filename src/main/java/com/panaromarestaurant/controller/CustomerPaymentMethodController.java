package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.CustomerPaymentMethod;
import com.panaromarestaurant.repository.CustomerPaymentMethodDao;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a REST controller to handle HTTP requests and return JSON responses
public class CustomerPaymentMethodController {

    @Autowired // Injects an instance of CustomerPaymentMethodDao into this controller
    private CustomerPaymentMethodDao customerPaymentMethodDao;

    // Handles GET requests to "/customerpaymentmethod/alldata"
    // Fetches all CustomerPaymentMethod records from the database
    // Returns the list as JSON, typically for use in frontend dropdowns or selections
    @GetMapping(value = "/customerpaymentmethod/alldata", produces = "application/json")
    public List<CustomerPaymentMethod> findAllData() {
        return customerPaymentMethodDao.findAll(); // Returns all records from the payment_method table
    }
}
