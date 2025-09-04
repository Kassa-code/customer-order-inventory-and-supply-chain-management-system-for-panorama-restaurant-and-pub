package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.SubMenuCategory;
import com.panaromarestaurant.repository.SubMenuCategoryDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller, meaning it will handle HTTP requests and return data (typically JSON)
public class SubMenuCategoryController { // Controller for handling SubMenuCategory-related endpoints

    @Autowired // Spring injects an instance of SubMenuCategoryDao for database interaction
    private SubMenuCategoryDao subMenuCategoryDao; // Repository to access and manage SubMenuCategory data

    // URL → [/submenucategory/alldata]
    // Handles GET requests to fetch all submenu category records
    // Returns a JSON list of SubMenuCategory entities for use in UI (e.g., dropdowns or tables)
    @GetMapping(value = "/submenucategory/alldata", produces = "application/json")
    public List<SubMenuCategory> findAllData() {
        return subMenuCategoryDao.findAll(); // Retrieves and returns all submenu category records
    }
}
