package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.IngredientCategory;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.repository.IngredientCategoryDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController // Marks this class as a Spring REST controller
public class IngredientCategoryController { // Start of the controller class

    @Autowired // Spring will inject an instance of IngredientCategoryDao here
    private IngredientCategoryDao ingredientCategoryDao; // Reference to the DAO that handles DB operations

    // Inject UserPrivilageController to check access control based on user
    // privileges
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Handle GET requests to "/ingredientcategory/alldata"
    // Fetch all ingredient category records as a JSON response [URL →
    // /ingredientcategory/alldata]
    @GetMapping(value = "/ingredientcategory/alldata", produces = "application/json")
    public List<IngredientCategory> findAllData() { // Method to return all records
        return ingredientCategoryDao.findAll(); // Call the DAO to fetch all ingredient categories
    }

    // URL → [/ingredientcategory/insert]
    // Inserts a new IngredientCategory record into the database,
    // only if the logged-in user has the 'insert' privilege
    @PostMapping(value = "/ingredientcategory/insert")
    public String saveIngredientCategoryData(@RequestBody IngredientCategory ingredientCategory) {

        // Retrieve the currently authenticated user's credentials from the Spring
        // Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch the user's privileges for the "Ingredient Category" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(),
                "Ingredient");

        // Proceed only if the user has insert permissions
        if (userPrivilage.getPrivilage_insert()) {

            // Check if a category with the same name already exists to prevent duplicates
            IngredientCategory extCategory = ingredientCategoryDao.getNameByName(ingredientCategory.getName());

            // If a matching record is found, return an appropriate message
            if (extCategory != null) {
                return "Save not completed: Entered Category " + ingredientCategory.getName()
                        + " already exists..!";
            }

            try {
                // Save the new category to the database
                ingredientCategoryDao.save(ingredientCategory);
                return "OK"; // Return success message if save operation succeeds

            } catch (Exception e) {
                // If any error occurs during the save, return the error message
                return "Save not completed: " + e.getMessage();
            }

        } else {
            // If the user lacks insert permissions, return an access denied message
            return "Insert not completed: You don't have any permission";
        }
    }

}