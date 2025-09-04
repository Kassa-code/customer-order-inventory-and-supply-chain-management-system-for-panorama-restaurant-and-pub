package com.panaromarestaurant.controller; 

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.SupplierStatus;
import com.panaromarestaurant.repository.SupplierStatusDao; 

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping; 

@RestController // Mark this class as a REST controller to handle HTTP requests and return JSON
public class SupplierStatusController {

    @Autowired // Automatically inject the SupplierStatusDao bean into this controller
    private SupplierStatusDao supplierStatusDao;

    // This method handles GET requests to "/supplierstatus/alldata"
    // It fetches all SupplierStatus records from the database
    // The result is returned in JSON format for use in frontend or API clients
    @GetMapping(value = "/supplierstatus/alldata", produces = "application/json")
    public List<SupplierStatus> findAllData() {
        return supplierStatusDao.findAll(); // Call the DAO method to retrieve all SupplierStatus entries
    }

}
