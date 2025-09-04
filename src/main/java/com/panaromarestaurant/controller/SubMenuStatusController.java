package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.SubMenuStatus;
import com.panaromarestaurant.repository.SubMenuStatusDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller, which handles HTTP requests and returns responses in JSON or other formats
public class SubMenuStatusController {

    @Autowired // Injects an instance of SubMenuStatusDao to access submenu status data from the database
    private SubMenuStatusDao subMenuStatusDao; // Repository for performing CRUD operations on SubMenuStatus

    // URL → [/submenustatus/alldata]
    // Handles GET requests to fetch all submenu status records from the database
    // Returns the list as JSON to the client (e.g., front-end UI)
    @GetMapping(value = "/submenustatus/alldata", produces = "application/json")
    public List<SubMenuStatus> findAllData() {
        return subMenuStatusDao.findAll();
    }
}
