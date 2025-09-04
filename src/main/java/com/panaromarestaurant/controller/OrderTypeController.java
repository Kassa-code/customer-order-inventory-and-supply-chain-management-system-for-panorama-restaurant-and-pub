package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.OrderType;
import com.panaromarestaurant.repository.OrderTypeDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Declares this class as a REST controller that returns JSON responses
public class OrderTypeController {

    @Autowired // Injects OrderTypeDao to access order type data from the database
    private OrderTypeDao orderTypeDao;

    // Endpoint to get all order types
    // URL → [/ordertype/alldata]
    @GetMapping(value = "/ordertype/alldata", produces = "application/json")
    public List<OrderType> findAllData() {
        return orderTypeDao.findAll(); // Returns a list of all OrderType records
    }
}
