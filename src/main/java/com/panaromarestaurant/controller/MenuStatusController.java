package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.MenuStatus;
import com.panaromarestaurant.repository.MenuStatusDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller, which handles HTTP requests and returns responses in JSON or other formats
public class MenuStatusController {

    @Autowired // Automatically injects the MenuStatusDao bean at runtime
    private MenuStatusDao menuStatusDao; // Repository for performing CRUD operations on MenuStatus entity

    // Handles GET requests to the endpoint /menustatus/alldata
    // URL → [/menustatus/alldata]
    // Produces a JSON response containing all menu status records
    @GetMapping(value = "/menustatus/alldata", produces = "application/json")
    public List<MenuStatus> findAllData() {
        return menuStatusDao.findAll(); // Retrieves all entries from the menu_status table
    }
}
