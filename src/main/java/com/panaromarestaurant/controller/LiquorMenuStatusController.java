package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.LiquorMenuStatus;
import com.panaromarestaurant.repository.LiquorMenuStatusDao;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller, which handles HTTP requests and returns responses in JSON or other formats
public class LiquorMenuStatusController {

    @Autowired // Injects an instance of LiquorMenuStatusDao to access liquormenu status data from the database
    private LiquorMenuStatusDao liquorMenuStatusDao; // Repository for performing CRUD operations on LiquorMenuStatus

    // URL → [/liquormenustatus/alldata]
    // Handles GET requests to fetch all liquormenu status records from the database
    // Returns the list as JSON to the client (e.g., front-end UI)
    @GetMapping(value = "/liquormenustatus/alldata", produces = "application/json")
    public List<LiquorMenuStatus> findAllData() {
        return liquorMenuStatusDao.findAll();
    }
}
