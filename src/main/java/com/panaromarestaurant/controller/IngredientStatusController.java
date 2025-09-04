package com.panaromarestaurant.controller; 

import org.springframework.web.bind.annotation.RestController; 
import com.panaromarestaurant.model.IngredientStatus;
import com.panaromarestaurant.repository.IngredientStatusDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller, meaning it will handle HTTP requests
public class IngredientStatusController {

    @Autowired // Spring automatically injects an instance of IngredientStatusDao here
    private IngredientStatusDao ingredientStatusDao; // DAO for accessing IngredientStatus data from the database

    // Handle GET requests to "/ingredientstatus/alldata"
    // This method will return all IngredientStatus records in JSON format
    // Fetch all IngredientStatus entries from the database and return them as JSON 
    //[URL → /ingredientstatus/alldata]
    @GetMapping(value = "/ingredientstatus/alldata", produces = "application/json")
    public List<IngredientStatus> findAllData() {
        return ingredientStatusDao.findAll(); 
    }
}
