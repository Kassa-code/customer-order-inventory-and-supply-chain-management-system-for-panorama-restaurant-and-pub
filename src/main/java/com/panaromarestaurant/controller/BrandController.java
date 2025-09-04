package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.Brand;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.repository.BrandDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController // Marks this class as a REST controller in Spring, enabling it to handle HTTP requests and return JSON/XML responses directly
public class BrandController {

    @Autowired // Tells Spring to inject the BrandDao dependency automatically (dependency injection)
    private BrandDao brandDao; // This is the DAO (Data Access Object) used to interact with the database table for the Brand entity

    // Inject UserPrivilageController to check access control based on user
    // privileges
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Handles GET requests sent to the URL "/brand/alldata"
    // Produces a JSON response containing all Brand records from the database
    // [URL → /brand/alldata]
    @GetMapping(value = "/brand/alldata", produces = "application/json") // Maps GET requests to /brand/alldata and sets response type to JSON
    public List<Brand> findAllData() {
        return brandDao.findAll(); // Uses Spring Data JPA's built-in findAll() method to retrieve all rows from the "brand" table
    }

    // Handles GET requests sent to the URL "/brand/bycategory/{categoryid}"
    // Retrieves a list of brands that are associated with a specific category ID
    // The value inside {categoryid} in the URL is dynamically mapped to the method parameter using @PathVariable
    // [URL → /brand/bycategory] → categoryid = 3
    @GetMapping(value = "/brand/bycategory/{categoryid}", produces = "application/json") // Uses {categoryid} as a path variable to filter by category
    public List<Brand> byCategory(@PathVariable("categoryid") Integer categoryid) { // @PathVariable binds the URL value to this method parameter
        return brandDao.byCategory(categoryid); // Calls a custom DAO method and passes the categoryid as an argument
    }

    // URL → [/ingredientbrand/insert]
    // Inserts a new Brand record into the database,
    // only if the logged-in user has the 'insert' privilege
    @PostMapping(value = "/ingredientbrand/insert")
    public String saveIngredientBrandData(@RequestBody Brand brand) {

        // Retrieve the currently authenticated user's credentials from Spring Security
        // context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch the user's privileges for the "Brand" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Brand");

        // Proceed only if the user has insert permissions
        if (userPrivilage.getPrivilage_insert()) {

            // Check if a brand with the same name already exists in the database
            Brand extBrand = brandDao.getNameByBrand(brand.getName());

            // If a matching brand is found, return a duplicate warning
            if (extBrand != null) {
                return "Save not completed: Entered Brand " + brand.getName() + " already exists..!";
            }

            try {
                // Save the new brand to the database
                brandDao.save(brand);

                // Return success response if saved successfully
                return "OK";

            } catch (Exception e) {
                // Return error message if an exception occurs during save
                return "Save not completed: " + e.getMessage();
            }

        } else {
            // If the user lacks permission, deny the operation
            return "Insert not completed: You don't have any permission";
        }
    }

}

// @PathVariable is used in controller methods to read values directly from the URL path. 
// For example: if the URL is /brand/bycategory/5, then 5 is passed to the method as categoryid using @PathVariable.
// It's useful when the data is part of the URL itself.

// @Param is used in DAO/repository methods to pass values into JPQL or SQL queries.
// It links the method's input parameter to a named variable in the query (e.g., :categoryId).
// This helps the query know which value to filter or search with when accessing the database.

// Example usage together:
// - Controller method uses @PathVariable to get categoryid from the URL.
// - That value is passed to the DAO method.
// - The DAO method uses @Param to insert the categoryid into the query and fetch matching data.
