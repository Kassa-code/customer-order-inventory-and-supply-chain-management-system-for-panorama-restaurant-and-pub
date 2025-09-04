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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.Supplier;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.SupplierDao;
import com.panaromarestaurant.repository.SupplierStatusDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// Marks the class as a REST controller to handle HTTP requests and send JSON responses
@RestController
public class SupplierController {

    // Injects SupplierDao for database operations on Supplier entities
    @Autowired
    private SupplierDao supplierDao;

    // Injects UserPrivilageController to check user permissions on modules
    @Autowired
    private UserPrivilageController userPrivilageController;

    @Autowired // Injects UserDao to fetch User details
    private UserDao userDao;

    @Autowired // Injects SupplierStatusDao to get supplier status references
    private SupplierStatusDao supplierStatusDao;

    // Handles GET requests to "/supplier"
    // Loads and returns the supplier UI page (supplier.html) with the logged-in
    // username
    @GetMapping(value = "/supplier")
    public ModelAndView loadSupplierUI() {
        // Retrieve the current authenticated user details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName()); 

        // Create ModelAndView object to render the view
        ModelAndView supplierView = new ModelAndView();

        // Specify the view (HTML page) to render
        supplierView.setViewName("supplier.html");

        // Add the logged-in username to the model to display on UI
        supplierView.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or path to photo) to the model for display
        supplierView.addObject("loggeduserphoto", logedUser.getUserphoto());

        supplierView.addObject("title", "Panorama Restaurant & Pub : Supplier Management");

        // Return the ModelAndView with view name and data
        return supplierView;
    }

    // Handles GET requests to "/supplier/alldata"
    // Returns all supplier records as JSON if user has select permission
    @GetMapping(value = "/supplier/alldata", produces = "application/json")
    public List<Supplier> findAllData() {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch privileges of the user for the Supplier module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Supplier");

        // Check if user has privilege to view supplier data
        if (userPrivilage.getPrivilage_select()) {
            // Return all suppliers sorted by id descending (newest first)
            return supplierDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // Return empty list if no permission to view
            return new ArrayList<>();
        }
    }

    // Handles POST requests to "/supplier/insert"
    // Inserts a new supplier record if user has insert privilege
    @PostMapping(value = "/supplier/insert")
    public String saveSupplierData(@RequestBody Supplier supplier) {
        // Get the current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch full user object from username
        User loggedUser = userDao.getByUsername(auth.getName());
        // Get user's privileges for Supplier module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Supplier");

        // Check insert privilege
        if (userPrivilage.getPrivilage_insert()) {
            try {
                // Set creation timestamp and user ID
                supplier.setAdded_datetime(LocalDateTime.now());
                supplier.setAdded_user_id(loggedUser.getId());
                supplier.setSup_no(supplierDao.getNextOrderCode()); // get next order code
                // Save supplier entity to the database
                supplierDao.save(supplier);
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

    // Handles PUT requests to "/supplier/update"
    // Updates an existing supplier record if user has update privilege
    @PutMapping(value = "/supplier/update")
    public String updateSupplierData(@RequestBody Supplier supplier) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch full user details
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get user's privileges for Supplier module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Supplier");

        // Check update permission
        if (userPrivilage.getPrivilage_update()) {

            // Check if supplier already exists
            if (supplier.getId() == null) {
                return "Update not completed: Supplier not exists ";
            }

            // Have sent a record but if not exists in the database
            Supplier extById = supplierDao.getReferenceById(supplier.getId());
            if (extById == null) {
                return "Update not completed: Supplier not exists ";
            }
            try {
                // Set update timestamp and user ID
                supplier.setUpdated_datetime(LocalDateTime.now());
                supplier.setUpdated_user_id(loggedUser.getId());

                // Save updated supplier to database
                supplierDao.save(supplier);
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

    // Handles DELETE requests to "/supplier/delete"
    // Performs a soft delete by marking supplier as deleted if user has delete
    // privilege
    @Transactional
    @DeleteMapping(value = "/supplier/delete")
    public String deletSuppliereData(@RequestBody Supplier supplier) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Fetch user privileges for Supplier module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Supplier");

        // Check delete permission
        if (userPrivilage.getPrivilage_delete()) {

            // Check if supplier already exists
        if (supplier.getId() == null) {
            return "Delete not completed: Supplier not exists ";
        }

        // Have sent a record but if not exists in the database
        Supplier extSupplierById = supplierDao.getReferenceById(supplier.getId());
        if (extSupplierById == null) {
            return "Delete not completed: Supplier not exists ";
        }
            try {
                // Set deleted timestamp and user ID
                supplier.setDeleted_datetime(LocalDateTime.now());
                supplier.setDeleted_user_id(userDao.getByUsername(auth.getName()).getId());
                // Set supplier status to 'deleted' (status id 3)
                supplier.setSupplier_status_id(supplierStatusDao.getReferenceById(3));

                // Save the updated supplier entity with deleted status
                supplierDao.save(supplier);
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

    // Handles GET requests to "/supplier/getbyid"
    // Returns a supplier by id if user has update privilege, else returns empty
    // Supplier object
    @GetMapping(value = "/supplier/getbyid", params = { "id" }, produces = "application/json")
    public Supplier getIngredientById(@RequestParam("id") Integer id) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch privileges for Supplier module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Supplier");

        // Check update privilege
        if (userPrivilage.getPrivilage_update()) {
            // Return supplier found by id
            return supplierDao.getReferenceById(id);
        } else {
            // Return empty supplier if no permission
            return new Supplier();
        }
    }
}
