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

import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.PurchaseOrder;
import com.panaromarestaurant.model.PurchaseOrderHasIngredients;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.PurchaseOrderDao;
import com.panaromarestaurant.repository.PurchaseOrderStatusDao;
import com.panaromarestaurant.repository.UserDao;
import jakarta.transaction.Transactional;

// Marking the class as a REST controller to handle HTTP requests and responses
@RestController
public class PurchaseOrderController {

    // Automatically injects the PurchaseOrderDao dependency using @Autowired
    // Spring will automatically create an instance of PurchaseOrderDao at runtime
    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    // Inject User repository to fetch user details
    @Autowired
    private UserDao userDao;

    // Automatically injects the UserPrivilageController dependency
    // Used to manage and verify user privileges based on roles
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Inject User repository to fetch purchase order status details
    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    // Mapping GET requests to "/purchaseorder" to load the purchase order UI
    // URL: [/purchaseorder]
    @GetMapping(value = "/purchaseorder")
    public ModelAndView loadUI() {
        // Retrieves the current authenticated user's details
        // The SecurityContextHolder holds security information for the current session
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName()); 
        // Creates a new ModelAndView object to manage the view and model data
        ModelAndView purchaseOrderView = new ModelAndView();

        // Sets the view name to "purchaseorder.html"
        purchaseOrderView.setViewName("purchaseorder.html");

        // Adds the username of the authenticated user to the model
        purchaseOrderView.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or path to photo) to the model for display
        purchaseOrderView.addObject("loggeduserphoto", logedUser.getUserphoto());

        purchaseOrderView.addObject("title", "Panorama Restaurant & Pub : Supplier Purchase Order Management");
        // Returns the configured ModelAndView object containing the view and data
        return purchaseOrderView;
    }

    // Handles GET requests to "/purchaseorder/alldata"
    // Returns a list of all purchase order records in JSON format
    // URL: [/purchaseorder/alldata]
    @GetMapping(value = "/purchaseorder/alldata", produces = "application/json")
    public List<PurchaseOrder> findAllData() {
        // Retrieves the authentication details of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Gets the user's privilege details for the "Purchase Order" module
        // Uses the username from the authentication object to retrieve specific
        // privileges
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "PurchaseOrder");

        // Checks if the user has permission to select data from the purchase order
        // module
        if (userPrivilage.getPrivilage_select()) {
            // If the user has the select permission, retrieve all purchase order records
            // The data is sorted in descending order by "id" so the latest records come
            // first
            return purchaseOrderDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // If the user lacks the select permission, return an empty list
            // This prevents unauthorized users from accessing purchase order data
            return new ArrayList<>();
        }
    }

    // URL → [/purchaseorder/insert]
    // Insert a new purchaseorder record into the database (only if user has
    // 'insert' privilege)
    @PostMapping(value = "/purchaseorder/insert")
    public String savePurchaseOrderData(@RequestBody PurchaseOrder purchaseOrder) {

        // Retrieves the current authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieves the logged-in user object using the username
        User loggedUser = userDao.getByUsername(auth.getName());
        // Retrieves the privilege of the logged-in user for the "PurchaseOrder" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "PurchaseOrder");

        // Check permission to insert a new purchase order
        if (userPrivilage.getPrivilage_insert()) {

            try {
                // Set metadata before saving
                purchaseOrder.setAdded_datetime(LocalDateTime.now()); // Sets the current date and time
                purchaseOrder.setAdded_user_id(loggedUser.getId()); // Sets the ID of the user who added the record
                purchaseOrder.setOrder_code(purchaseOrderDao.getNextOrderCode()); // Generates the next order code

                // Iterate through each ingredient in the purchase order and set the reference
                // to the purchase order as we block the recursion in the
                // PurchaseOrderHasIngredients using @JsonIgnore
                // This prevents circular references during JSON serialization and ensures
                // that the purchase order ID is correctly linked to each ingredient entry
                for (PurchaseOrderHasIngredients pohi : purchaseOrder.getPurchaseOrderHasItemList()) {
                    // Establishes a link between the purchase order and each ingredient line item
                    pohi.setSupplierpurchaseorder_id(purchaseOrder);
                }

                // Save the complete purchase order object, including associated ingredients, to
                // the database
                purchaseOrderDao.save(purchaseOrder);
                return "OK";
            } catch (Exception e) {
                // Return detailed error message if save operation fails
                return "Save not completed: " + e.getMessage();
            }
        } else {
            // Return message indicating insufficient insert privileges
            return "Insert not completed: You don't have any permission";
        }
    }    
    
   
    // URL → [/purchaseorder/update]
    // Update an existing purchaseorder record in the database (only if user has 'update' privilege)
    @PutMapping(value = "/purchaseorder/update")
    public String updatePurchaseOrderData(@RequestBody PurchaseOrder purchaseOrder) {
        
        // Get the current authenticated user details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Get the logged-in user object by username
        User loggedUser = userDao.getByUsername(auth.getName());
        
        // Get the privileges for the "PurchaseOrder" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "PurchaseOrder");

        // Check if the user has permission to update
        if (userPrivilage.getPrivilage_update()) {

            try {
                // Set metadata before updating
                purchaseOrder.setUpdated_datetime(LocalDateTime.now()); // Set current date and time
                purchaseOrder.setUpdated_user_id(loggedUser.getId());   // Set the updater's user ID

                // Loop through all line items and bind them to the purchase order
                for (PurchaseOrderHasIngredients pohi : purchaseOrder.getPurchaseOrderHasItemList()) {
                    pohi.setSupplierpurchaseorder_id(purchaseOrder); // Set purchase order reference to avoid circular JSON issues
                }

                // Save the purchase order with all its items to the database
                purchaseOrderDao.save(purchaseOrder);
                return "OK";

            } catch (Exception e) {
                // Return error message if update fails
                return "Update not completed: " + e.getMessage();
            }

        } else {
            // Return permission denied message
            return "Update not completed: You don't have any permission";
        }
    }


    // URL → [/purchaseorder/delete]
    // Soft delete a purchase order record (mark as deleted instead of removing from DB) - only if user has 'delete' privilege
    @Transactional
    @DeleteMapping(value = "/purchaseorder/delete")
    public String deletePurchaseOrderData(@RequestBody PurchaseOrder purchaseOrder) {
        
        // Get the current authenticated user details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Get the logged-in user object by username
        User loggedUser = userDao.getByUsername(auth.getName());
        
        // Get the privileges for the "PurchaseOrder" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "PurchaseOrder");

        // Check if the user has permission to delete
        if (userPrivilage.getPrivilage_delete()) {

            try {
                // Set metadata before soft deletion
                purchaseOrder.setDeleted_datetime(LocalDateTime.now()); // Set current date and time
                purchaseOrder.setDeleted_user_id(loggedUser.getId());   // Set the deleter's user ID
                purchaseOrder.setSupplierpurchaseorder_status_id(purchaseOrderStatusDao.getReferenceById(3)); // Status 5 = Deleted
                // Loop through all line items and bind them to the purchase order
                for (PurchaseOrderHasIngredients pohi : purchaseOrder.getPurchaseOrderHasItemList()) {
                    pohi.setSupplierpurchaseorder_id(purchaseOrder); // Set purchase order reference to avoid circular JSON issues
                }

                // Save the updated (soft-deleted) purchase order to the database
                purchaseOrderDao.save(purchaseOrder);
                return "OK";

            } catch (Exception e) {
                // Return error message if deletion fails
                return "Delete not completed: " + e.getMessage();
            }

        } else {
            // Return permission denied message
            return "Delete not completed: You don't have any permission";
        }
    }

    // Handles GET requests to retrieve a list of purchase orders associated with a
    // specific supplier
    // URL: [/purchaseorder/listbysupplier/1]
    // URL pattern: /purchaseorder/listbysupplier/{supplierid}
    // REST endpoint to get all purchase orders for a given supplier ID
    @GetMapping(value = "purchaseorder/listbysupplier/{supplierid}", produces = "application/json")
    public List<PurchaseOrder> purchaseOrderListBySupplier(@PathVariable("supplierid") Integer supplierid) {

        // Retrieve the currently authenticated user's details from the Spring Security
        // context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get the user's privileges for the "Purchase Order" module using the username
        // and module name
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Purchase Order");

        // Check if the user has 'select' permission for this module
        if (userPrivilage.getPrivilage_select()) {
            // If the user has permission, return the list of purchase orders for the given
            // supplier ID
            return purchaseOrderDao.getPurchaseOrderListBySupplier(supplierid);
        } else {
            // If the user lacks permission, return an empty list to prevent unauthorized
            // access
            return new ArrayList<>();
        }
    }

}
