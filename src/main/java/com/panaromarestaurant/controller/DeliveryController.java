package com.panaromarestaurant.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Delivery;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.DeliveryDao;
import com.panaromarestaurant.repository.UserDao;

// Marks the class as a REST controller to handle HTTP requests and send JSON responses
@RestController
public class DeliveryController {

    // Injects VehicleDao for database operations on Vehicle entities
    @Autowired
    private DeliveryDao deliveryDao;

    // Injects UserPrivilageController to check user permissions on modules
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Injects UserDao to fetch User details
    @Autowired
    private UserDao userDao;

    // Handles GET requests to "/vehicle"
    // Loads and returns the vehicle UI page (vehicle.html) with the logged-in
    // username and user photo
    @GetMapping(value = "/delivery")
    public ModelAndView loadDeliveryUI() {
        // Retrieve the current authenticated user details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User loggedUser = userDao.getByUsername(auth.getName());

        // Create ModelAndView object to render the view
        ModelAndView deliveryView = new ModelAndView();

        // Specify the view (HTML page) to render
        deliveryView.setViewName("delivery.html");

        // Add the logged-in username to the model to display on UI
        deliveryView.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or path to photo) to the model for display
        deliveryView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        deliveryView.addObject("title", "Panorama Restaurant & Pub : Delivery Management");

        // Return the ModelAndView with view name and data
        return deliveryView;
    }

    // Handles GET requests to "/delivery/alldata"
    // Returns all vehicle records as JSON if user has select permission
    @GetMapping(value = "/delivery/alldata", produces = "application/json")
    public List<Delivery> findAllData() {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch privileges of the user for the Vehicle module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Delivery");

        // Check if user has privilege to view vehicle data
        if (userPrivilage.getPrivilage_select()) {
            // Return all vehicles sorted by id descending (newest first)
            return deliveryDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // Return empty list if no permission to view
            return new ArrayList<>();
        }
    }

    // Handles POST requests to "/delivery/insert"
    // Inserts a new vehicle record if user has insert privilege
    @PostMapping(value = "/delivery/insert")
    public String saveVehicleData(@RequestBody Delivery delivery) {
        // Get the current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch full user object from username
        // Get user's privileges for Vehicle module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Delivery");

        // Check insert privilege
        if (userPrivilage.getPrivilage_insert()) {
            try {
                delivery.setCode(deliveryDao.getNextOrderCode());
                deliveryDao.save(delivery);
                return "OK";
            } catch (Exception e) {
                // Return error message if save fails
                return "Save not completed: " + e.getMessage();
            }
        } else {
            // Return permission error if insert not allowed
            return "Insert not completed: You don't have any permission";
        }
    }

}
