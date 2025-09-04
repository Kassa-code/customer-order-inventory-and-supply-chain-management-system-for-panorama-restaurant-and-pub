package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.LiquorMenuCategory;
import com.panaromarestaurant.repository.LiquorMenuCategoryDao;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Defines this class as a REST controller that returns JSON responses
public class LiquorMenuCategoryController {

    @Autowired // Injects LiquorMenuCategoryDao for DB operations
    private LiquorMenuCategoryDao liquorMenuCategoryDao;

    // URL → [/liquormenucategory/alldata]
    // Returns all LiquorMenuCategory records as JSON
    @GetMapping(value = "/liquormenucategory/alldata", produces = "application/json")
    public List<LiquorMenuCategory> findAllData() {
        return liquorMenuCategoryDao.findAll();
    }
}
