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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.LiquorMenu;
import com.panaromarestaurant.model.LiquorMenuHasIngredients;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.LiquorMenuDao;
import com.panaromarestaurant.repository.LiquorMenuStatusDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// SubMenuController handles all HTTP requests related to submenu operations (CRUD)
// Includes UI loading, data fetching, insertion, update, and soft deletion
@RestController
public class LiquorMenuController {

    // Inject SubMenu repository to perform database operations on the SubMenu
    // entity
    @Autowired
    private LiquorMenuDao liquorMenuDao;

    // Inject User repository to fetch details of the logged-in user from the
    // database
    @Autowired
    private UserDao userDao;

    // Inject SubMenuStatus repository to manage the status of submenu items (e.g.,
    // active, deleted)
    @Autowired
    private LiquorMenuStatusDao liquorMenuStatusDao;

    // Inject UserPrivilageController to perform privilege checks and access control
    // for the current user
    @Autowired
    private UserPrivilageController userPrivilageController;

    // URL → [/liquormenu]
    // Controller method to handle GET requests to the URL [/liquormenu]
    // This method is responsible for loading the submenu UI page
    @GetMapping(value = "/liquormenu")
    public ModelAndView loadLiquorMenuUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView liquorMenuUI = new ModelAndView();

        // Set the view name to "liquormenu.html", which will be resolved by the view
        // resolver
        liquorMenuUI.setViewName("liquormenu.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        liquorMenuUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or its path) to the model for display in the
        // view
        liquorMenuUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        liquorMenuUI.addObject("title", "Panorama Restaurant & Pub : Liquor Menu Management");

        // Return the ModelAndView object to render the view along with the model data
        return liquorMenuUI;
    }

    // URL → [/liquormenu/alldata]
    // Handles GET requests to fetch all submenu data, typically for populating a UI
    // table
    // Access is granted only if the logged-in user has 'select' privilege for the
    // "Liquor Menu" module
    @GetMapping(value = "/liquormenu/alldata", produces = "application/json")
    public List<LiquorMenu> findAllData() {

        // Retrieve the authentication details of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get the user's privileges for the "Liquor Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Liquor_Menu");

        // Check if the user has the 'select' privilege
        if (userPrivilage.getPrivilage_select()) {
            // If allowed, return all submenu entries sorted by ID in descending order
            return liquorMenuDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // If not allowed, return an empty list
            return new ArrayList<>();
        }
    }

    // URL → [/liquormenu/insert]
    // Handles POST requests to insert a new SubMenu record into the database
    // Only allowed if the user has the 'insert' privilege for the "Liquor Menu" module
    @PostMapping(value = "/liquormenu/insert")
    public String saveLiquorMenuData(@RequestBody LiquorMenu liquorMenu) {

        // Retrieve the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get the privileges of the logged-in user for the "Liquor Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Liquor_Menu");

        // Check if the user has insert permission
        if (userPrivilage.getPrivilage_insert()) {

            // Check if a submenu item with the same name already exists in the database
            LiquorMenu extItemName = liquorMenuDao.getByName(liquorMenu.getName());
            if (extItemName != null) {
                // Prevent duplicate names and return an error message
                return "Save not completed: Entered Name " + liquorMenu.getName() + " already exists..!";
            }

            try {
                // Set metadata fields before saving
                liquorMenu.setAdded_datetime(LocalDateTime.now()); // Set the current timestamp
                liquorMenu.setAdded_user_id(loggedUser.getId()); // Set the ID of the user adding the record
                
                // Set the liquor menu reference for each ingredient relation before saving
                for (LiquorMenuHasIngredients pohi : liquorMenu.getLiquorMenuHasIngredientList()) {
                    pohi.setLiquormenu_id(liquorMenu);
                }

                // Save the new submenu item to the database
                liquorMenuDao.save(liquorMenu);
                return "OK"; // Return success message
            } catch (Exception e) {
                // Return failure message with exception details
                return "Save not completed: " + e.getMessage();
            }

        } else {
            // If the user doesn't have permission to insert
            return "Insert not completed: You don't have any permission";
        }
    }

    // URL → [/liquormenu/update]
    // Handles PUT requests to update an existing LiquorMenu record
    // Only allowed if the logged-in user has 'update' privileges for the "Liquor Menu"
    // module
    @PutMapping(value = "/liquormenu/update")
    public String updateLiquorMenuData(@RequestBody LiquorMenu liquorMenu) {

        // Retrieve the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get the user's privileges for the "Liquor Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Liquor_Menu");

        // Check if the user has update permission
        if (userPrivilage.getPrivilage_update()) {

            // Validation: Ensure the SubMenu object has an ID (required for update)
            if (liquorMenu.getId() == null) {
                return "Update not completed: Liquor Menu not exists";
            }

            // Check if a SubMenu with the given ID exists in the database
            LiquorMenu extById = liquorMenuDao.getReferenceById(liquorMenu.getId());
            if (extById == null) {
                return "Update not completed: Liquor Menu not exists";
            }

            // Check if another SubMenu with the same name already exists (excluding current
            // ID)
            LiquorMenu extLiquorMneuByName = liquorMenuDao.getByName(liquorMenu.getName());
            if (extLiquorMneuByName != null && extLiquorMneuByName.getId() != liquorMenu.getId()) {
                return "Update not completed: Liquor menu Name " + liquorMenu.getName() + " already exists..!";
            }

            try {
                // Set update metadata: timestamp and updating user ID
                liquorMenu.setUpdated_datetime(LocalDateTime.now());
                liquorMenu.setUpdated_user_id(loggedUser.getId());

                // Set the liquor menu reference for each ingredient relation before saving
                for (LiquorMenuHasIngredients pohi : liquorMenu.getLiquorMenuHasIngredientList()) {
                    pohi.setLiquormenu_id(liquorMenu);
                }

                // Save the updated SubMenu object to the database
                liquorMenuDao.save(liquorMenu);

                return "OK"; // Return success response

            } catch (Exception e) {
                // Handle and report exceptions that occur during update
                return "Update not completed: " + e.getMessage();
            }

        } else {
            // If the user doesn't have permission to update
            return "Update not completed: You don't have any permission";
        }
    }

    // URL → [/liquormenu/delete]
    // Handles DELETE requests to perform a soft delete on a LiquorMenu item
    // Instead of removing the record from the database, it marks it as deleted
    // Operation is only allowed if the user has 'delete' privileges
    @Transactional // Ensures the delete operation is executed within a transactional context
    @DeleteMapping(value = "/liquormenu/delete")
    public String deleteLiquorMenu(@RequestBody LiquorMenu liquorMenu) {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch user privileges for the "Liquor Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Liquor_Menu");

        // Check if the user has permission to delete
        if (userPrivilage.getPrivilage_delete()) {

            // Validate: SubMenu ID must be provided
            if (liquorMenu.getId() == null) {
                return "Delete not completed: Liquor Menu not Exists..!";
            }

            // Attempt to fetch the existing LiquorMenu record by ID
            LiquorMenu extLiquorMenuById = liquorMenuDao.getReferenceById(liquorMenu.getId());
            if (extLiquorMenuById == null) {
                return "Delete not completed: Liquor Menu not Exists..!";
            }

            try {
                // Set metadata for soft delete
                extLiquorMenuById.setDeleted_datetime(LocalDateTime.now()); // Timestamp for deletion
                extLiquorMenuById.setDeleted_user_id(userDao.getByUsername(auth.getName()).getId()); // Who deleted it
                extLiquorMenuById.setLiquormenu_status_id(liquorMenuStatusDao.getReferenceById(3)); // Status ID 3 = Deleted (assumed convention)

                // Set the liquor menu reference for each ingredient relation before saving
                for (LiquorMenuHasIngredients pohi : liquorMenu.getLiquorMenuHasIngredientList()) {
                    pohi.setLiquormenu_id(liquorMenu);
                }

                // Persist the changes (soft delete)
                liquorMenuDao.save(extLiquorMenuById);

                return "OK"; // Deletion successful
            } catch (Exception e) {
                // Handle exception during delete process
                return "Delete not completed: " + e.getMessage();
            }

        } else {
            // User does not have delete permissions
            return "Delete not completed: You don't have any permission";
        }
    }

    // URL → [/liquormenu/byname/{name}]
    // Handles GET requests to fetch a LiquorMenu entity by its name
    // Returns the LiquorMenu object in JSON format if found
    @GetMapping(value = "/liquormenu/byname/{name}", produces = "application/json")
    public LiquorMenu findByName(@PathVariable("name") String name) {
        return liquorMenuDao.getByName(name);
    }

    @GetMapping (value = "/liquormenu/activelist", produces = "application/json")
     public List <LiquorMenu> getAvailableLiquorMenuList (){

            return liquorMenuDao.getAvailableLiquorMenus();
    }
}
