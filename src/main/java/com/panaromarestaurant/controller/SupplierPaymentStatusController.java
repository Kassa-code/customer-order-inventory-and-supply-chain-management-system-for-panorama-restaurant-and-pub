package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.SupplierPaymentStatus;
import com.panaromarestaurant.repository.SupplierPaymentStatusDao;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a REST controller to handle HTTP requests and return JSON responses
public class SupplierPaymentStatusController {

    @Autowired // Injects an instance of SupplierPaymentStatusDao into this controller
    private SupplierPaymentStatusDao supplierPaymentStatusDao;

    // Handles GET requests to "/supplierpaymentstatus/alldata"
    // Fetches all SupplierPaymentStatus records from the database
    // Returns the list as JSON, typically for use in frontend dropdowns or selections
    @GetMapping(value = "/supplierpaymentstatus/alldata", produces = "application/json")
    public List<SupplierPaymentStatus> findAllData() {
        return supplierPaymentStatusDao.findAll(); // Returns all records from the supplierpaymentstatus table
    }
}
