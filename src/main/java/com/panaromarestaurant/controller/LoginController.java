package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.ChangeUser;
import com.panaromarestaurant.model.Module;
import com.panaromarestaurant.model.Role;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.ModuleDao;
import com.panaromarestaurant.repository.RoleDao;
import com.panaromarestaurant.repository.UserDao;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

// Define this class as a REST controller that handles login-related requests
@RestController
public class LoginController {

    // Inject the UserDao to interact with user data
    @Autowired
    private UserDao userDao;

    // Inject the RoleDao to interact with role data
    @Autowired
    private RoleDao roleDao;

    // Inject the RoleDao to interact with module data
    @Autowired
    private ModuleDao moduleDao;

    // Inject the password encoder to encode user passwords
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // Handles requests to the "/login" URL
    // Returns the login page UI
    @RequestMapping(value = "/login")
    public ModelAndView loadLoginUI() {
        ModelAndView loginUI = new ModelAndView(); // Create a ModelAndView object
        loginUI.setViewName("login.html"); // Set the view name to the login page
        return loginUI; // Return the ModelAndView object
    }

    // Handles requests to the "/dashboard" URL
    // Returns the dashboard page UI
    @RequestMapping(value = "/dashboard")
    public ModelAndView loadDashboardUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a new ModelAndView object to render a view with model data
        ModelAndView dashboardUI = new ModelAndView();

        // Set the name of the view to be rendered (dashboard.html)
        dashboardUI.setViewName("dashboard.html");

        // Add the logged-in user's username to the model so it can be accessed in the
        // view
        dashboardUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or path to photo) to the model for display
        dashboardUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        dashboardUI.addObject("title", "Panorama Restaurant & Pub : Dashboard");

        // Return the ModelAndView object with view name and model data
        return dashboardUI;

    }

    // Handles requests to the "/errorpage" URL
    // Returns the error page UI
    @RequestMapping(value = "/errorpage")
    public ModelAndView loadErrorPageUI() {
        ModelAndView errorPageUI = new ModelAndView(); // Create a ModelAndView object
        errorPageUI.setViewName("errorpage.html"); // Set the view name to the error page
        return errorPageUI; // Return the ModelAndView object
    }

    // Handles requests to the "/createadmin" URL
    // Creates an admin user if not already present and redirects to login page
    @RequestMapping(value = "/createadmin")
    public ModelAndView generateAdminAccount() {

        // Check if an admin user already exists
        User extAdminUser = userDao.getByUsername("Admin");

        // If admin does not exist, create a new one
        if (extAdminUser == null) {
            User adminUser = new User(); // Create a new User object
            adminUser.setUsername("Admin"); // Set username
            adminUser.setEmail("adminpanaromarestaurant@gmail.com"); // Set email
            adminUser.setStatus(true); // Enable the user
            adminUser.setAdded_datetime(LocalDateTime.now()); // Set current timestamp
            adminUser.setPassword(bCryptPasswordEncoder.encode("12345")); // Encode and set password

            // Assign role to admin user
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleDao.getReferenceById(1); // Get role with ID 1 from database role column
            roles.add(adminRole); // Add role to the set
            adminUser.setRoles(roles); // Set roles for the user

            // Save the admin user to the database
            userDao.save(adminUser);
        }

        ModelAndView loginUI = new ModelAndView(); // Create a ModelAndView object
        loginUI.setViewName("login.html"); // Set the view name to the login page
        return loginUI; // Return the ModelAndView object
    }

    // Handles requests to the "/index" URL
    // Returns the index page UI
    @RequestMapping(value = "/index")
    public ModelAndView loadIndexUI() {
        ModelAndView indexUI = new ModelAndView(); // Create a ModelAndView object
        indexUI.setViewName("index.html"); // Set the view name to the index page
        return indexUI; // Return the ModelAndView object
    }

    // Handles requests to the "/administration" URL
    // Returns the administration page UI
    @RequestMapping(value = "/administration")
    public ModelAndView loadAdministrationUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView administrationUI = new ModelAndView(); // Create a ModelAndView object
        administrationUI.setViewName("administration.html"); // Set the view name to the administration page

        administrationUI.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        administrationUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        administrationUI.addObject("title", "Panorama Restaurant & Pub : Administration Management Page");
        return administrationUI; // Return the ModelAndView object
    }

    // Handles requests to the "/suppliermanagement" URL
    // Returns the suppliermanagement page UI
    @RequestMapping(value = "/suppliermanagement")
    public ModelAndView loadSupplierManagementUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView supplierManagementUI = new ModelAndView(); // Create a ModelAndView object
        supplierManagementUI.setViewName("suppliermanagement.html"); // Set the view name to the suppliermanagement page

        supplierManagementUI.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        supplierManagementUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        supplierManagementUI.addObject("title", "Panorama Restaurant & Pub : Supplier Management Page");
                                                                          
        return supplierManagementUI; // Return the ModelAndView object
    }

    // Handles requests to the "/suppliermanagement" URL
    // Returns the inventorymanagement page UI
    @RequestMapping(value = "/inventorymanagement")
    public ModelAndView loadInventoryUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView inventoryUI = new ModelAndView(); // Create a ModelAndView object
        inventoryUI.setViewName("inventorymanagement.html"); // Set the view name to the inventorymanagement page

        inventoryUI.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        inventoryUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        inventoryUI.addObject("title", "Panorama Restaurant & Pub : Inventory Management Page");
        return inventoryUI; // Return the ModelAndView object
    }

    // Handles requests to the "/menumanagement" URL
    // Returns the menumanagement page UI
    @RequestMapping(value = "/menumanagement")
    public ModelAndView loadMenuUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView MenuUI = new ModelAndView(); // Create a ModelAndView object
        MenuUI.setViewName("menumanagement.html"); // Set the view name to the menumanagement page
        MenuUI.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        MenuUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        MenuUI.addObject("title", "Panorama Restaurant & Pub : Menu Management Page");
        return MenuUI; // Return the ModelAndView object
    }

    // Handles requests to the "/reportsmanagement" URL
    // Returns the reportsmanagement page UI
    @RequestMapping(value = "/reportsmanagement")
    public ModelAndView loadReportUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView ReportUI = new ModelAndView(); // Create a ModelAndView object
        ReportUI.setViewName("reportsmanagement.html"); // Set the view name to the menumanagement page
        ReportUI.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        ReportUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        ReportUI.addObject("title", "Panorama Restaurant & Pub : Report Management Page");
        return ReportUI; // Return the ModelAndView object
    }

    // Handles requests to the "/deliverymanagement" URL
    // Returns the deliverymanagement page UI
    @RequestMapping(value = "/deliverymanagement")
    public ModelAndView loadDeliveryUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView deliveryUI = new ModelAndView(); // Create a ModelAndView object
        deliveryUI.setViewName("deliverymanagement.html"); // Set the view name to the menumanagement page
        deliveryUI.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        deliveryUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        deliveryUI.addObject("title", "Panorama Restaurant & Pub : Delivery Management Page");
        return deliveryUI; // Return the ModelAndView object
    }

    // Handles requests to the "/deliverymanagement" URL
    // Returns the deliverymanagement page UI
    @RequestMapping(value = "/orderprocessing")
    public ModelAndView loadOrderProcessingUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        ModelAndView deliveryUI = new ModelAndView(); // Create a ModelAndView object
        deliveryUI.setViewName("orderprocessing.html"); // Set the view name to the menumanagement page
        deliveryUI.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        deliveryUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        deliveryUI.addObject("title", "Panorama Restaurant & Pub : Order Management Page");
        return deliveryUI; // Return the ModelAndView object
    }

    // Handles requests to the "/deliverymanagement" URL
    // Returns the deliverymanagement page UI
    @RequestMapping(value = "/userprofile")
    public ModelAndView loadUserProfileEditUI() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView userProfileEditUI = new ModelAndView(); // Create a ModelAndView object
        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());
        userProfileEditUI.setViewName("userprofile.html"); // Set the view name to the menumanagement page
        userProfileEditUI.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        userProfileEditUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        userProfileEditUI.addObject("title", "Panorama Restaurant & Pub : User Profile Edit Page");
        return userProfileEditUI; // Return the ModelAndView object
    }

    // Handles requests to the "/deliverymanagement" URL
    // Returns the deliverymanagement page UI
    @RequestMapping(value = "/loggeduserdetails")
    public ChangeUser getLoggedUserDetails() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logedUser = userDao.getByUsername(auth.getName());

        ChangeUser changeUser = new ChangeUser();
        changeUser.setUsername(logedUser.getUsername());
        changeUser.setOldusername(logedUser.getUsername());
        changeUser.setEmail(logedUser.getEmail());
        changeUser.setUserphoto(logedUser.getUserphoto());

        return changeUser;
    }

    // Handles requests to the "/changeuserdetails" URL
    // Returns the deliverymanagement page UI
    // This method handles HTTP POST requests sent to "/changeuserdetails/insert".
    // It accepts a ChangeUser object from the request body to update logged-in
    // user's details.
    @PostMapping(value = "/changeuserdetails/insert")
    public String insertLoggedUserDetails(@RequestBody ChangeUser changeUser) {

        // Attempt to retrieve the existing user from the database by using the old
        // username provided.
        User extUser = userDao.getByUsername(changeUser.getOldusername());

        // If the user is not found (i.e., extUser is null), return a failure message
        // indicating user does not exist.
        if (extUser == null) {
            return "Change not completed: User Not Exists..!";
        }

        // Check if the new username already exists in the system and does not belong to
        // the current user.
        // This prevents assigning a username that is already taken by another user.
        User extUserByUserName = userDao.getByUsername(changeUser.getUsername());
        if (extUserByUserName != null && extUser.getId() != extUserByUserName.getId()) {
            return "Change not completed: User Already Exists..!";
        }

        try {
            // Proceed with password change only if the old password is provided in the
            // request.
            if (changeUser.getOldpassword() != null) {

                // Verify if the provided old password matches the existing user's stored
                // password.
                if (bCryptPasswordEncoder.matches(changeUser.getOldpassword(), extUser.getPassword())) {

                    // Ensure the new password is different from the old password before updating.
                    if (!bCryptPasswordEncoder.matches(changeUser.getNewpassword(), extUser.getPassword())) {

                        // Encode the new password and update the user object.
                        extUser.setPassword(bCryptPasswordEncoder.encode(changeUser.getNewpassword()));
                    } else {
                        return "Change not completed: Password Not Changed..!";
                    }

                } else {
                    // If the old password doesn't match, return a failure message.
                    return "Change not completed: User Old Password Not Match for Old Password..!";
                }
            }

            // Update the username with the new value from the request.
            extUser.setUsername(changeUser.getUsername());

            // Update the email with the new value from the request.
            extUser.setEmail(changeUser.getEmail());

            // Update the user photo with the new value from the request.
            extUser.setUserphoto(changeUser.getUserphoto());

            // Save the updated user object to the database.
            userDao.save(extUser);

            // Return success message upon successful update.
            return "OK";

        } catch (Exception e) {
            // If an exception occurs during the update process, catch it and return an
            // error message.
            return "Update not completed: " + e.getMessage();
        }

    }

    // Handles HTTP GET requests to "/modulewithoutuser".
    // Returns a list of Module objects as a JSON response.
    // These are the modules the currently logged-in user does NOT have "select"
    // privileges for.
    @RequestMapping(value = "/modulewithoutuser")
    public List<Module> getModuleListByUser() {

        // Retrieve the authentication object for the currently logged-in user.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch the full User entity from the database using the username from
        // authentication.
        User logedUser = userDao.getByUsername(auth.getName());

        // Special case: if the logged-in user is "Admin", return an empty list.
        // Admin is assumed to have full access, so there are no "restricted" modules to
        // hide.
        if (auth.getName().equalsIgnoreCase("Admin")) {
            return new ArrayList<>();
        } else {
            // Query the database to retrieve the modules where the given user
            // does NOT have select privileges. This uses a custom native SQL query.
            return moduleDao.getModulesByUser(logedUser.getUsername());
        }
    }

}
