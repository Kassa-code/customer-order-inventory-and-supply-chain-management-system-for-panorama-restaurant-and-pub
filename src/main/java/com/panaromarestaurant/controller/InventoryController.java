package com.panaromarestaurant.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Inventory;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.InventoryDao;
import com.panaromarestaurant.repository.UserDao;

// InventoryController handles HTTP requests related to Inventory operations like UI loading and data fetching
@RestController
public class InventoryController {

    // Inject InventoryDao to interact with inventory table in the database
    @Autowired
    private InventoryDao inventoryDao;

    // Inject UserDao to retrieve logged-in user details
    @Autowired
    private UserDao userDao;

    // Inject UserPrivilageController to check current user's privileges
    @Autowired
    private UserPrivilageController userPrivilageController;

    // URL → [/inventory]
    // Load the Inventory UI page
    @GetMapping(value = "/inventory")
    public ModelAndView loadInventoryUI() {
        // Get the currently authenticated user's information
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logedUser = userDao.getByUsername(auth.getName());

        // Create the ModelAndView object for the inventory.html page
        ModelAndView inventoryUi = new ModelAndView();
        inventoryUi.setViewName("inventory.html");

        // Add username and user photo for the UI to display
        inventoryUi.addObject("loggedusername", auth.getName());
        inventoryUi.addObject("loggeduserphoto", logedUser.getUserphoto());
        inventoryUi.addObject("title", "Panorama Restaurant & Pub : Inventory Management");

        return inventoryUi;
    }

    // URL → [/inventory/alldata]
    // Returns all inventory records in JSON format if the user has 'select'
    // permission
    @GetMapping(value = "/inventory/alldata", produces = "application/json")
    public List<Inventory> findAllData() {
        // Get currently authenticated user and check privileges
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Inventory");

        // Only return data if the user has 'select' privilege
        if (userPrivilage.getPrivilage_select()) {
            return inventoryDao.findAll(Sort.by(Direction.DESC, "id")); // Sorted by ID descending
        } else {
            return new ArrayList<>(); // Return empty list if no permission
        }
    }

    // URL → [/inventory/byingredient?ingredients_id=]
    // Handles GET requests to fetch inventory records filtered by the given
    // ingredient ID
    // The 'ingredients_id' parameter is required in the query string
    // Returns a JSON list of Inventory objects related to the specified ingredient
    @GetMapping(value = "/inventory/byingredient", params = { "ingredients_id" }, produces = "application/json")
    public List<Inventory> findByName(@RequestParam("ingredients_id") Integer ingredients_id) {
        // Calls the Inventory DAO method to fetch inventory records by ingredient ID
        return inventoryDao.getByIngredient(ingredients_id);
    }
}
