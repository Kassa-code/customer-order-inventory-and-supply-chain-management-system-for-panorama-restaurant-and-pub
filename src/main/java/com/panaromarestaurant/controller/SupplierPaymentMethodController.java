package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.SupplierPaymentMethod;
import com.panaromarestaurant.repository.SupplierPaymentMethodDao;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a REST controller to handle HTTP requests and return JSON responses
public class SupplierPaymentMethodController {

    @Autowired // Injects an instance of SupplierPaymentMethodDao into this controller
    private SupplierPaymentMethodDao supplierPaymentMethodDao;

    // Handles GET requests to "/supplierpaymentmethod/alldata"
    // Fetches all SupplierPaymentMethod records from the database
    // Returns the list as JSON, typically for use in frontend dropdowns or selections
    @GetMapping(value = "/supplierpaymentmethod/alldata", produces = "application/json")
    public List<SupplierPaymentMethod> findAllData() {
        return supplierPaymentMethodDao.findAll(); // Returns all records from the supplierpaymentmethod table
    }
}
