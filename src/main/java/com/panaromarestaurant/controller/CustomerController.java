package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Customer;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.CustomerDao;
import com.panaromarestaurant.repository.UserDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController // Marks this class as a Spring REST controller
public class CustomerController { // Start of the controller class

    @Autowired // Injects CustomerDao for DB access
    private CustomerDao customerDao;

    @Autowired // Injects UserPrivilageController to check user permissions
    private UserPrivilageController userPrivilageController;

    // Injects UserDao to fetch User details
    @Autowired
    private UserDao userDao;

    // Handle GET requests to "/customer/alldata"
    // Returns a list of all customers as JSON
    @GetMapping(value = "/customer/alldata", produces = "application/json")
    public List<Customer> findAllData() {
        return customerDao.findAll(Sort.by(Sort.Direction.DESC, "id")); // Fetch all customer records
    }

    // Handles GET requests to "/vehicle"
    // Loads and returns the vehicle UI page (vehicle.html) with the logged-in
    // username and user photo
    @GetMapping(value = "/customer")
    public ModelAndView loadCustomerUI() {
        // Retrieve the current authenticated user details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User loggedUser = userDao.getByUsername(auth.getName());

        // Create ModelAndView object to render the view
        ModelAndView customerView = new ModelAndView();

        // Specify the view (HTML page) to render
        customerView.setViewName("customer.html");

        // Add the logged-in username to the model to display on UI
        customerView.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or path to photo) to the model for display
        customerView.addObject("loggeduserphoto", loggedUser.getUserphoto());

        customerView.addObject("title", "Panorama Restaurant & Pub : Customer Management");

        // Return the ModelAndView with view name and data
        return customerView;
    }


    // Handle POST request to "/customer/insert"
    // Inserts a new customer if the logged-in user has 'insert' privilege
    @PostMapping(value = "/customer/insert")
    public String saveIngredientCategoryData(@RequestBody Customer customer) {

        // Get the currently authenticated user from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check the privileges of the user for "Customer" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Customer");

        // Proceed if the user has insert privilege
        if (userPrivilage.getPrivilage_insert()) {

            // Check if customer with the same mobile already exists
            Customer extCustomerByMobile = customerDao.getByMobile(customer.getContactno());
            if (extCustomerByMobile != null) {
                return "Save not completed: Entered Mobile " + customer.getContactno() + " already exists..!";
            }

            try {
                // Save the new customer to the database
                customerDao.save(customer);
                return "OK"; // Success message
            } catch (Exception e) {
                // Handle and return error message if save fails
                return "Save not completed: " + e.getMessage();
            }

        } else {
            // User doesn't have permission to insert
            return "Insert not completed: You don't have any permission";
        }
    }

     // Handles PUT requests to "/customer/update"
    // Updates an existing customer record if user has update privilege
    @PutMapping(value = "/customer/update")
    public String updateVehicleData(@RequestBody Customer customer) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get user's privileges for Vehicle module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Customer");

        // Check update permission
        if (userPrivilage.getPrivilage_update()) {
            
            // Check if customer with the same mobile already exists
            Customer extCustomerByMobile = customerDao.getByMobile(customer.getContactno());
            if (extCustomerByMobile != null) {
                return "Save not completed: Entered Mobile " + customer.getContactno() + " already exists..!";
            }
            try {
               
                // Save updated vehicle record
                customerDao.save(customer);
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

    
    // URL: [GET] /customer/bycontactno/{contactno}
    // Example: /customer/bycontactno/0771234567
    // Purpose: Retrieve a customer by their contact number.
    // If the customer is found, return the customer object.
    // If not found, return an empty Customer object.

    @GetMapping(value = "/customer/bycontactno/{contactno}", produces = "application/json")
    public Customer getByContactNo(@PathVariable("contactno") String contactno) {
        // Get customer from the database using the given contact number
        Customer customer = customerDao.getByMobile(contactno);

        // Return the customer if found, otherwise return a new empty customer
        if (customer != null) {
            return customer;
        } else {
            return new Customer();
        }
    }

}
