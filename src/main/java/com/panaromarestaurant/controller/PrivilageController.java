package com.panaromarestaurant.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
// Import necessary classes for the controller and ModelAndView
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.PrivilageDao;
import com.panaromarestaurant.repository.UserDao;

// This is a Spring REST controller for handling the "privilage" endpoint
@RestController
public class PrivilageController {

    @Autowired
    private PrivilageDao privilageDao; // Injects the DAO for privilage operations

    @Autowired
    private UserPrivilageController userPrivilageController; // Create custom controller to check user privileges

    @Autowired
    private UserDao userDao;

    // Mapping GET requests to "/privilage" and returning the privilage UI
    // URL: [/privilage]
    @GetMapping(value = "/privilage")
    public ModelAndView getPrivilageUi() {
        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Creating a new ModelAndView object to represent the "privilage" view

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView privilageView = new ModelAndView();

        // Setting the view name for the UI to "privilage.html"
        privilageView.setViewName("privilage.html");
        privilageView.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model
        // Add the logged-in user's photo (or path to photo) to the model for display
        privilageView.addObject("loggeduserphoto", logedUser.getUserphoto());

        privilageView.addObject("title", "Panorama Restaurant & Pub : User Privilage Management");
        // Returning the ModelAndView object containing the view name
        return privilageView;
    }

    // Handles GET requests to "/privilage/alldata"
    // This endpoint returns all privilage records from the database.
    // The data is returned in JSON format for front-end consumption or API usage.
    // URL: [/privilage/alldata]
    @GetMapping(value = "/privilage/alldata", produces = "application/json")
    public List<Privilage> getAllPrivilageData() {
        // Get currently logged-in user from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch the user's privilages for the "Privilage" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Privilage");

        // If user has privilage_select permission, fetch and return all data
        if (userPrivilage.getPrivilage_select()) {
            // Retrieve all privilage entries from the database
            // Sort them in descending order by "id" so that the newest records come first
            return privilageDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // If user doesn't have select permission, return an empty list
            return new ArrayList<>();
        }
    }

    // Insert a new Privilage
    @PostMapping(value = "/privilage/insert")
    // This endpoint will insert a new privilage into the database.
    // Returns a success or error message based on the operation's outcome.
    public String insertPrivilage(@RequestBody Privilage privilage) {
        // Get currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch user's privilege on the "Privilage" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Privilage");

        // If the user has insert permission
        if (userPrivilage.getPrivilage_insert()) {
            // Retrieve any existing privilage with the same role and module to check for
            // duplicates
            Privilage extPrivilage = privilageDao.getPrivilageRoleModule(privilage.getRole_id().getId(),
                    privilage.getModule_id().getId());

            // If a duplicate privilege record already exists
            if (extPrivilage != null) {
                // Return a message indicating that a duplicate entry exists
                return "Save not completed: Privilage already exists";
            }

            try {
                // Save the new privilage into the database
                privilageDao.save(privilage);
                // Return a success message if the insertion was successful
                return "OK";
            } catch (Exception e) {
                // Return an error message if the save operation fails
                return "Save not completed: " + e.getMessage();
            }
        } else {
            // If the user does not have insert permission
            return "Save not completed: You don't have any permission";
        }
    }

    // Update an existing Privilage
    @PutMapping(value = "/privilage/update")
    // This endpoint updates an existing privilage in the database.
    // Returns a success message if the update is successful, or an error message if
    // any issues occur.
    public String updatePrivilage(@RequestBody Privilage privilage) {
        // Get currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch user's privilege on the "Privilage" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Privilage");

        // If the user has update permission
        if (userPrivilage.getPrivilage_update()) {
            // Fetch existing privilage with the same role and module to check for
            // duplicates
            Privilage extPrivilage = privilageDao.getPrivilageRoleModule(privilage.getRole_id().getId(),
                    privilage.getModule_id().getId());

            // Check if a different record already exists with same role-module
            if (extPrivilage != null && extPrivilage.getId() != privilage.getId()) {
                // Return an error if duplicate entry found
                return "Update not completed: Privilage already exists";
            }

            try {
                // Save the updated privilage into the database
                privilageDao.save(privilage);
                // Return a success message if update was successful
                return "OK";
            } catch (Exception e) {
                // Return an error message if update fails
                return "Update not completed: " + e.getMessage();
            }
        } else {
            // If the user does not have update permission
            return "Update not completed: You don't have any permission";
        }
    }

    // Delete a Privilage (soft delete, effectively deactivates the privilage)
    @DeleteMapping(value = "/privilage/delete")
    // This endpoint deletes an existing privilage from the database.
    // In this case, it's a "soft delete," which means deactivating the privilage.
    // Returns a success message if the delete is successful, or an error message if
    // any issues occur.
    public String deletePrivilage(@RequestBody Privilage privilage) {
        // Get currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch user's privilege on the "Privilage" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Privilage");

        // If the user has delete permission
        if (userPrivilage.getPrivilage_delete()) {
            try {
                // Set all privilege flags to false (soft delete)
                privilage.setPrivilage_select(false);
                privilage.setPrivilage_insert(false);
                privilage.setPrivilage_update(false);
                privilage.setPrivilage_delete(false);

                // Save the updated privilage record (effectively disables it)
                privilageDao.save(privilage);

                // Return success response
                return "OK";
            } catch (Exception e) {
                // Return error if deletion fails
                return "Delete not completed: " + e.getMessage();
            }
        } else {
            // If the user does not have delete permission
            return "Delete not completed: You don't have any permission";
        }
    }

}
