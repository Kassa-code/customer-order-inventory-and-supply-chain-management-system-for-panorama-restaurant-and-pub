
package com.panaromarestaurant.controller;
import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.PurchaseOrderStatus;
import com.panaromarestaurant.repository.PurchaseOrderStatusDao;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

// Mark this class as a REST controller to handle HTTP requests
@RestController
public class PurchaseOrderStatusController {

    // Automatically inject the PurchaseOrderStatusDao dependency
    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    // Endpoint to retrieve all purchase order status data
    // URL: [/purchaseorderstatus/alldata]
    @GetMapping(value = "/purchaseorderstatus/alldata", produces = "application/json")
    public List<PurchaseOrderStatus> findAllData() {
        // Fetch all records from the database and return as JSON
        return purchaseOrderStatusDao.findAll();
    }
}
