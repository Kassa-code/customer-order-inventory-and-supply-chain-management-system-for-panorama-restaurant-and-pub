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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.model.Vehicle;
import com.panaromarestaurant.repository.UserDao;
import com.panaromarestaurant.repository.VehicleDao;
import com.panaromarestaurant.repository.VehicleStatusDao;

import jakarta.transaction.Transactional;

// Marks the class as a REST controller to handle HTTP requests and send JSON responses
@RestController
public class VehicleController {

    // Injects VehicleDao for database operations on Vehicle entities
    @Autowired
    private VehicleDao vehicleDao;

    // Injects UserPrivilageController to check user permissions on modules
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Injects UserDao to fetch User details
    @Autowired
    private UserDao userDao;

    // Injects VehicleStatusDao to get vehicle status references
    @Autowired
    private VehicleStatusDao vehicleStatusDao;

    // Handles GET requests to "/vehicle"
    // Loads and returns the vehicle UI page (vehicle.html) with the logged-in
    // username and user photo
    @GetMapping(value = "/vehicle")
    public ModelAndView loadVehicleUI() {
        // Retrieve the current authenticated user details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User loggedUser = userDao.getByUsername(auth.getName());

        // Create ModelAndView object to render the view
        ModelAndView vehicleView = new ModelAndView();

        // Specify the view (HTML page) to render
        vehicleView.setViewName("vehicle.html");

        // Add the logged-in username to the model to display on UI
        vehicleView.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or path to photo) to the model for display
        vehicleView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        vehicleView.addObject("title", "Panorama Restaurant & Pub : Vehicle Management");

        // Return the ModelAndView with view name and data
        return vehicleView;
    }

    // Handles GET requests to "/vehicle/alldata"
    // Returns all vehicle records as JSON if user has select permission
    @GetMapping(value = "/vehicle/alldata", produces = "application/json")
    public List<Vehicle> findAllData() {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch privileges of the user for the Vehicle module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Vehicle");

        // Check if user has privilege to view vehicle data
        if (userPrivilage.getPrivilage_select()) {
            // Return all vehicles sorted by id descending (newest first)
            return vehicleDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // Return empty list if no permission to view
            return new ArrayList<>();
        }
    }

    // Handles POST requests to "/vehicle/insert"
    // Inserts a new vehicle record if user has insert privilege
    @PostMapping(value = "/vehicle/insert")
    public String saveVehicleData(@RequestBody Vehicle vehicle) {
        // Get the current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch full user object from username
        User loggedUser = userDao.getByUsername(auth.getName());
        // Get user's privileges for Vehicle module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Vehicle");

        // Check insert privilege
        if (userPrivilage.getPrivilage_insert()) {
            try {
                // Set creation timestamp and user ID
                vehicle.setAdded_datetime(LocalDateTime.now());
                vehicle.setAdded_user_id(loggedUser.getId());

                // Save the new vehicle record
                vehicleDao.save(vehicle);
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

    // Handles PUT requests to "/vehicle/update"
    // Updates an existing vehicle record if user has update privilege
    @PutMapping(value = "/vehicle/update")
    public String updateVehicleData(@RequestBody Vehicle vehicle) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch full user details
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get user's privileges for Vehicle module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Vehicle");

        // Check update permission
        if (userPrivilage.getPrivilage_update()) {

            // Check if vehicle already exists (ID must not be null)
            if (vehicle.getId() == null) {
                return "Update not completed: Vehicle does not exist";
            }

            // Verify vehicle exists in database
            Vehicle extById = vehicleDao.getReferenceById(vehicle.getId());
            if (extById == null) {
                return "Update not completed: Vehicle does not exist";
            }
            try {
                // Set update timestamp and user ID
                vehicle.setUpdated_datetime(LocalDateTime.now());
                vehicle.setUpdated_user_id(loggedUser.getId());

                // Save updated vehicle record
                vehicleDao.save(vehicle);
                return "OK";

            } catch (Exception e) {
                // Return error message if update fails
                return "Update not completed: " + e.getMessage();
            }

        } else {
            // Return permission error if update not allowed
            return "Update not completed: You don't have any permission";
        }
    }

    // Handles DELETE requests to "/vehicle/delete"
    // Performs a soft delete by marking vehicle as deleted if user has delete
    // privilege
    @Transactional
    @DeleteMapping(value = "/vehicle/delete")
    public String deleteVehicleData(@RequestBody Vehicle vehicle) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch user privileges for Vehicle module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Vehicle");

        // Check delete permission
        if (userPrivilage.getPrivilage_delete()) {

            // Check if vehicle ID is provided
            if (vehicle.getId() == null) {
                return "Delete not completed: Vehicle does not exist";
            }

            // Verify vehicle exists in database
            Vehicle extVehicleById = vehicleDao.getReferenceById(vehicle.getId());
            if (extVehicleById == null) {
                return "Delete not completed: Vehicle does not exist";
            }
            try {
                // Set deleted timestamp and user ID
                vehicle.setDeleted_datetime(LocalDateTime.now());
                vehicle.setDeleted_user_id(userDao.getByUsername(auth.getName()).getId());

                // Set vehicle status to 'deleted' (status id 2 assumed here)
                vehicle.setVehicle_status_id(vehicleStatusDao.getReferenceById(2));

                // Save the updated vehicle entity with deleted status
                vehicleDao.save(vehicle);
                return "OK";
            } catch (Exception e) {
                // Return error message if deletion fails
                return "Delete not completed: " + e.getMessage();
            }
        } else {
            // Return permission error if delete not allowed
            return "Delete not completed: You don't have any permission";
        }
    }

     @GetMapping (value = "/vehicle/activelist", produces = "application/json")
     public List <Vehicle> getAvailableVehicleList (){
            return vehicleDao.getAvailableVehicles();
    }
}
