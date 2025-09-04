package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.IngredientSubCategory;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.repository.IngredientSubCategoryDao;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController // Marks this class as a Spring REST controller, so methods return JSON/XML directly
public class IngredientSubCategoryController {

    @Autowired // Injects the IngredientSubCategoryDao bean so we can call its methods
    private IngredientSubCategoryDao ingredientSubCategoryDao;

    // Inject UserPrivilageController to check access control based on user
    // privileges
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Handle GET requests to "/ingredientsubcategory/alldata"
    // Returns all IngredientSubCategory records as JSON
    // Example URL: GET /ingredientsubcategory/alldata
    @GetMapping(value = "/ingredientsubcategory/alldata", produces = "application/json")
    public List<IngredientSubCategory> findAllData() {
        // Calls JpaRepository.findAll() to fetch every subcategory entry from the database
        return ingredientSubCategoryDao.findAll();
    }

    // Handle GET requests to "ingredientsubcategory/bycategory?categoryid=1" with a required query parameter
    // Example URL: ingredientsubcategory/bycategory?categoryid=1
    @GetMapping(value    = "/ingredientsubcategory/bycategory",params   = {"categoryid"}, 
    produces = "application/json")

    // Binds the URL query parameter 'categoryid' to this method argument
    public List<IngredientSubCategory> byCategory(@RequestParam("categoryid") Integer categoryid ) {
        return ingredientSubCategoryDao.byCategory(categoryid);
    }
    // Calls our custom repository method, passing in the category ID from the URL
        // ingredientSubCategoryDao.byCategory(categoryid) runs a JPQL query:
        //   SELECT sc FROM IngredientSubCategory sc WHERE sc.ingredientCategory.id = ?1
        // where ?1 is replaced by the value of 'categoryid'


// URL → [/ingredientsubcategory/insert]
// Inserts a new IngredientSubCategory record into the database,
// only if the logged-in user has the 'insert' privilege
@PostMapping(value = "/ingredientsubcategory/insert")
public String saveIngredientSubCategoryData(@RequestBody IngredientSubCategory ingredientSubCategory) {

    // Retrieve the currently authenticated user
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    // Fetch the user's privileges for the "Ingredient Sub Category" module
    Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Ingredient");

    // Check if the user has insert permission
    if (userPrivilage.getPrivilage_insert()) {

        // Validate: Check if a subcategory with the same name exists under the same category
        IngredientSubCategory extSubCategory = ingredientSubCategoryDao.getNameByCategory(
            ingredientSubCategory.getName(),ingredientSubCategory.getIngredient_category_id().getId());

        // If a matching subcategory already exists, return a failure message
        if (extSubCategory != null) {
            return "Save not completed: Entered Sub Category " + ingredientSubCategory.getName() + " already exists..!";
        }

        try {
            // Save the new subcategory to the database
            ingredientSubCategoryDao.save(ingredientSubCategory);
            return "OK"; // Return success message
        } catch (Exception e) {
            // Catch any exceptions during save and return the error message
            return "Save not completed: " + e.getMessage();
        }

    } else {
        // If the user doesn't have permission, deny the operation
        return "Insert not completed: You don't have any permission";
    }
}

}
