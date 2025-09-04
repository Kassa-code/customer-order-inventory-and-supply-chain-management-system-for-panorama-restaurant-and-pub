package com.panaromarestaurant.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.UserDao;

@RestController
public class UserController {

    // Injects the Data Access Object for performing CRUD operations on User entities
    @Autowired
    private UserDao userDao;

    // Injects a custom controller used to retrieve the logged-in user's privileges for specific modules
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Injects the BCrypt password encoder to securely hash user passwords before storing them
    @Autowired
    private BCryptPasswordEncoder bcCryptPasswordEncoder;

    // Mapping GET requests to "/user" and returning the user UI
    // URL: [/user]
    @RequestMapping(value = "/user")
    public ModelAndView loadUserUi() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object for the User UI
        ModelAndView userView = new ModelAndView();
        userView.setViewName("user.html"); // Set the view name to load the corresponding HTML page
        userView.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or image path) to the model (for frontend
        // display)
        userView.addObject("loggeduserphoto", logedUser.getUserphoto());

        userView.addObject("title", "Panorama Restaurant & Pub : User Management");

        return userView; // Return the configured ModelAndView object
    }

    // Handles GET requests to "/user/alldata"
    // This endpoint returns all user records from the database, excluding the
    // current user and 'Admin'.
    // Data is returned in JSON format for frontend or API consumption.
    @GetMapping(value = "/user/alldata", produces = "application/json")
    public List<User> getUserAllData() {

        // Retrieve the currently authenticated user from Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch the privilege object of the current user for the "User" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "User");

        // Check if the user has 'select' permission (read access) for the User module
        if (userPrivilage.getPrivilage_select()) {
            // If allowed, fetch and return all users excluding the current one and 'Admin'
            // The list is sorted in descending order by ID (assuming that's the setup in
            // userDao)
            return userDao.findAllExceptUsername(auth.getName());
        } else {
            // If the user lacks 'select' privileges, return an empty list to indicate no
            // access
            return new ArrayList<>();
        }
    }

    // Create a DELETE mapping for deleting employee data from the database
    // The API endpoint is: [URL → /user/delete]

    @DeleteMapping(value = "/user/delete")
    public String deleteUser(@RequestBody User user) {

        // Retrieve the currently authenticated user from Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch the privilege object of the current user for the "User" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "User");

        // Check if the user has 'delete' permission for the User module
        if (userPrivilage.getPrivilage_delete()) {

            // Try to get the existing user from the database using ID
            User extUser = userDao.getReferenceById(user.getId());

            // If the user does not exist, return an appropriate message
            if (extUser == null) {
                return "Delete not completed: User Not Exists..!";
            }

            try {
                // Soft delete: mark the user as inactive (status = false)
                extUser.setStatus(false);

                // Set the deletion timestamp to current time
                extUser.setDeleted_datetime(LocalDateTime.now());

                // Save the changes back to the database
                userDao.save(extUser);

                // Return success response
                return "OK";

            } catch (Exception e) {
                // Return failure response with the exception message if an error occurs
                return "Delete not completed: " + e.getMessage();
            }

        } else {
            // Return failure response if the user does not have delete privileges
            return "Delete not completed: You don't have any permission..!";
        }
    }

    // Create a POST API endpoint to insert a new user into the system
    // Endpoint: [POST → /user/insert]
    @PostMapping(value = "/user/insert")
    public String insertUser(@RequestBody User user) {

        // Get the currently logged-in user's authentication object from the security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the privilege object for the current user for the "User" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "User");

        // Check if the user has insert privileges for the User module
        if (userPrivilage.getPrivilage_insert()) {

            try {
                // Encrypt the user's password before saving it
                user.setPassword(bcCryptPasswordEncoder.encode(user.getPassword()));

                // Set the current timestamp for when the user is added
                user.setAdded_datetime(LocalDateTime.now());

                // Save the user to the database
                userDao.save(user);

                // Return success response
                return "OK";

            } catch (Exception e) {
                // If any error occurs during the save operation, return the error message
                return "Insert not completed: " + e.getMessage();
            }

        } else {
            // If the user does not have permission to insert, return a permission error
            return "Insert not completed: You don't have any permission..!";
        }
    }

    // Create a PUT API endpoint to update an existing user in the system
    // Endpoint: [PUT → /user/update]
    @PutMapping(value = "/user/update")
    public String updateUser(@RequestBody User user) {

        // Get the currently logged-in user's authentication object from the security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the privilege object for the current user for the "User" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "User");

        // Check if the user has update privileges for the User module
        if (userPrivilage.getPrivilage_update()) {

            // Try to get the existing user from the database using the user's ID
            User extUser = userDao.getReferenceById(user.getId());

            // If the user does not exist, return an appropriate message
            if (extUser == null) {
                return "Update not completed: User Not Exists..!";
            }

            // TODO: Check for duplicate users based on username or email
            // You can perform a check to ensure there is no other user with the same username or email
            // Example: if (userDao.existsByUsernameOrEmail(user.getUsername(), user.getEmail())) { ... }

            try {
                // (Optional) Encrypt the user's password before saving it (currently commented out)
                // user.setPassword(bcCryptPasswordEncoder.encode(user.getPassword()));

                // Set the current timestamp for when the user is updated
                user.setUpdated_datetime(LocalDateTime.now());

                // Save the updated user to the database
                userDao.save(user);

                // Return success response
                return "OK";

            } catch (Exception e) {
                // If any error occurs during the update operation, return the error message
                return "Update not completed: " + e.getMessage();
            }

        } else {
            // If the user does not have permission to update, return a permission error
            return "Update not completed: You don't have any permission..!";
        }
    }
    
}
