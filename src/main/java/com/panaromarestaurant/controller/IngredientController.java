package com.panaromarestaurant.controller;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Ingredient;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.IngredientDao;
import com.panaromarestaurant.repository.IngredientStatusDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// IngredientController handles all HTTP requests related to ingredient operations (CRUD)
// Includes UI loading, data fetching, insertion, update, and soft deletion
@RestController
public class IngredientController {

    // Inject Ingredient repository to perform database operations on the Ingredient entity
    @Autowired
    private IngredientDao ingredientDao;

    // Inject User repository to fetch user details
    @Autowired
    private UserDao userDao;

    // Inject IngredientStatus repository to set ingredient status (like deleted)
    @Autowired
    private IngredientStatusDao ingredientStatusDao;

    // Inject UserPrivilageController to check access control based on user privileges
    @Autowired
    private UserPrivilageController userPrivilageController;

    // URL → /ingredient
    // Load Ingredient UI page
    @GetMapping(value = "/ingredient")
    public ModelAndView loadIngredientUI() {
        // Get the currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a view object and set the view name to ingredient.html
        ModelAndView ingredientUi = new ModelAndView();
        ingredientUi.setViewName("ingredient.html");

        // Add the username of the logged-in user to the view
        ingredientUi.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or path to photo) to the model for display
        ingredientUi.addObject("loggeduserphoto", logedUser.getUserphoto());

        ingredientUi.addObject("title", "Panorama Restaurant & Pub : Ingredient Management");

        return ingredientUi;
    }

    // URL → [/ingredient/alldata]
    // Fetch all ingredient data for UI table (only if user has 'select' privilege)
    @GetMapping(value = "/ingredient/alldata", produces = "application/json")
    public List<Ingredient> findAllData() {
        // Get the logged-in user's authentication and privileges
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Ingredient");

        // Return all ingredients sorted by ID descending, if user has permission
        if (userPrivilage.getPrivilage_select()) {
            return ingredientDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    // URL → [/ingredient/insert]
    // Insert a new ingredient record into the database (only if user has 'insert' privilege)
    @PostMapping(value = "/ingredient/insert")
    public String saveIngredientData(@RequestBody Ingredient ingredient) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Ingredient");

        // Check permission
        if (userPrivilage.getPrivilage_insert()) {
            // Check if an ingredient with the same name already exists
            Ingredient extItemName = ingredientDao.getByItemName(ingredient.getItemname());
            if (extItemName != null) {
                return "Save not completed: Entered Item Name " + ingredient.getItemname() + " already exists..!";
            }

            try {
                // Set metadata before saving
                ingredient.setAdded_datetime(LocalDateTime.now());
                ingredient.setAdded_user_id(loggedUser.getId());
                ingredient.setItemcode(ingredientDao.getNextItemCode());

                // Save to database
                ingredientDao.save(ingredient);
                return "OK";
            } catch (Exception e) {
                return "Save not completed: " + e.getMessage();
            }
        } else {
            return "Insert not completed: You don't have any permission";
        }
    }

    // URL → [/ingredient/update]
    // Update an existing ingredient (only if user has 'update' privilege)
    @PutMapping(value = "/ingredient/update")
    public String updateIngredientData(@RequestBody Ingredient ingredient) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Ingredient");

        // Check permission
        if (userPrivilage.getPrivilage_update()) {
            // Validate: ID must be present
            if (ingredient.getId() == null) {
                return "Update not completed: Ingredient not exists ";
            }

            // Check if ID exists in DB
            Ingredient extById = ingredientDao.getReferenceById(ingredient.getId());
            if (extById == null) {
                return "Update not completed: Ingredient not exists ";
            }

            // Check if another ingredient with the same name exists
            Ingredient extIngredientByName = ingredientDao.getByItemName(ingredient.getItemname());
            if (extIngredientByName != null && extIngredientByName.getId() != ingredient.getId()) {
                return "Update not completed: Entered Item Name " + ingredient.getItemname() + " already exists..!";
            }

            try {
                // Set update metadata and save
                ingredient.setUpdated_datetime(LocalDateTime.now());
                ingredient.setUpdated_user_id(loggedUser.getId());
                ingredientDao.save(ingredient);

                return "OK";
            } catch (Exception e) {
                return "Update not completed: " + e.getMessage();
            }

        } else {
            return "Update not completed: You don't have any permission";
        }
    }

    // URL → [/ingredient/delete]
    // Soft delete an ingredient (mark as deleted instead of removing from DB)
    @Transactional
    @DeleteMapping(value = "/ingredient/delete")
    public String deleteIngredient(@RequestBody Ingredient ingredient) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Ingredient");

        // Check permission
        if (userPrivilage.getPrivilage_delete()) {
            // Validate: ID must be provided
            if (ingredient.getId() == null) {
                return "Delete not completed: Item not Exists..!";
            }

            // Check if ingredient exists in DB
            Ingredient extIngredientById = ingredientDao.getReferenceById(ingredient.getId());
            if (extIngredientById == null) {
                return "Delete not completed: Item not Exists..!";
            }

            try {
                // Set delete metadata
                extIngredientById.setDeleted_datetime(LocalDateTime.now());
                extIngredientById.setDeleted_user_id(userDao.getByUsername(auth.getName()).getId());
                extIngredientById.setStatus_id(ingredientStatusDao.getReferenceById(3)); // Status 3 = Deleted

                // Save soft-deleted ingredient
                ingredientDao.save(extIngredientById);
                return "OK";
            } catch (Exception e) {
                return "Delete not completed: " + e.getMessage();
            }

        } else {
            return "Delete not completed: You don't have any permission";
        }
    }

    // Handles GET requests to fetch a list of ingredients that are not supplied by a specific supplier
    // URL: [/ingredient/listwithoutsupply?supplierid=]
    @GetMapping(value = "/ingredient/listwithoutsupply", params = {"supplierid"}, produces = "application/json")
    public List <Ingredient> getIngredientListWithoutSupplyById(@RequestParam("supplierid") Integer supplierid) {
        // Get currently logged-in user from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch the user's privileges for the "Ingredient" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(),  "Ingredient");

        // Check if the user has the privilege to update data
        if (userPrivilage.getPrivilage_update()) {
        // Fetch and return the list of ingredients that are not supplied by the given supplier ID
            return ingredientDao.getListWithoutSupply(supplierid);
        } else {
            // Return an empty Ingredient object if the user lacks update permission
            return new ArrayList<>();
        }
    }

    // Handles GET requests to retrieve a list of ingredients associated with a
    // specific supplier
    // URL: [/ingredient/listbysupplier/1]

    @GetMapping(value = "/ingredient/listbysupplier/{supplierid}", produces = "application/json")
    public List<Ingredient> getIngredientListBySupplier(@PathVariable("supplierid") Integer supplierid) {
        // Get the current authenticated user's details from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the user's privileges for the "Ingredient" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Ingredient");

        // Check if the user has permission to view (select) data
        if (userPrivilage.getPrivilage_select()) {
            // If the user has the privilege, return the list of ingredients supplied by the
            // given supplier ID
            return ingredientDao.getListBySupplier(supplierid);
        } else {
            // If the user does not have permission, return an empty list
            return new ArrayList<>();
        }
    }

    // Handles GET requests to retrieve a list of ingredients
    // URL: [/ingredient/list]

    @GetMapping(value = "/ingredient/list", produces = "application/json")
    public List<Ingredient> getIngredientList() {
        // Get the currently authenticated user's information using Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the privilege object for the logged-in user related to the
        // "Ingredient" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Ingredient");

        // Check if the user has permission to view/select ingredient data
        if (userPrivilage.getPrivilage_select()) {
            // User has permission: return the full ingredient list from the DAO
            return ingredientDao.getIngredientList();
        } else {
            // User lacks permission: return an empty list to indicate access denial
            return new ArrayList<>();
        }
    }

}
