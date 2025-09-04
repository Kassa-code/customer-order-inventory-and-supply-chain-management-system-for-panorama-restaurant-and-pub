package com.panaromarestaurant.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.GoodReceiveNote;
import com.panaromarestaurant.model.GrnHasIngredients;
import com.panaromarestaurant.model.Inventory;
import com.panaromarestaurant.model.Privilage;
// import com.panaromarestaurant.model.PurchaseOrder;
// import com.panaromarestaurant.model.PurchaseOrderHasIngredients;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.GoodReceiveNoteDao;
import com.panaromarestaurant.repository.InventoryDao;
// import com.panaromarestaurant.repository.PurchaseOrderDao;
// import com.panaromarestaurant.repository.PurchaseOrderStatusDao;
import com.panaromarestaurant.repository.UserDao;

@RestController
public class GoodReceiveNoteController {

    // Inject GoodReceiveNote repository to manage good receive note data operations
    @Autowired
    private GoodReceiveNoteDao goodReceiveNoteDao;

    // Inject User repository to fetch user details
    @Autowired
    private UserDao userDao;

    // Automatically injects the UserPrivilageController dependency
    // Used to manage and verify user privileges based on roles
    @Autowired
    private UserPrivilageController userPrivilageController;

    @Autowired
    private InventoryDao inventoryDao;

    // @Autowired
    // private PurchaseOrderDao purchaseOrderDao;

    // @Autowired
    // private PurchaseOrderStatusDao purchaseOrderStatusDao;

    // Mapping GET requests to "/goodreceivenote" to load the good receive note UI
    // URL: [/goodreceivenote]
    @GetMapping(value = "/goodreceivenote")
    public ModelAndView loadGoodReceiveNoteUI() {
        // Retrieves the current authenticated user's details
        // The SecurityContextHolder holds security information for the current session
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        // Creates a new ModelAndView object to manage the view and model data
        ModelAndView goodReceiveNoteView = new ModelAndView();

        // Sets the view name to "goodreceivenote.html"
        goodReceiveNoteView.setViewName("goodreceivenote.html");

        // Adds the username of the authenticated user to the model
        goodReceiveNoteView.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or path to photo) to the model for display
        goodReceiveNoteView.addObject("loggeduserphoto", logedUser.getUserphoto());

        goodReceiveNoteView.addObject("title", "Panorama Restaurant & Pub : Good Receive Note Management");

        // Returns the configured ModelAndView object containing the view and data
        return goodReceiveNoteView;
    }

    // Handles GET requests to "/goodreceivenote/alldata"
    // Returns a list of all goodreceivenote records in JSON format
    // URL: [/goodreceivenote/alldata]
    @GetMapping(value = "/goodreceivenote/alldata", produces = "application/json")
    public List<GoodReceiveNote> findAllData() {
        // Retrieves the authentication details of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Gets the user's privilege details for the "Good Receive Note" module
        // Uses the username from the authentication object to retrieve specific privileges
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Good Receive Note");

        // Checks if the user has permission to select data from the good receive note module
        if (userPrivilage.getPrivilage_select()) {
            // If the user has the select permission, retrieve all good receive note records
            // The data is sorted in descending order by "id" so the latest records come first
            return goodReceiveNoteDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // If the user lacks the select permission, return an empty list
            // This prevents unauthorized users from accessing good receive note data
            return new ArrayList<>();
        }
    }

    // URL → [/goodreceivenote/insert]
    // Insert a new good receive note record into the database (only if user has 'insert' privilege)
    @PostMapping(value = "/goodreceivenote/insert")
    public String saveGoodReceiveNoteData(@RequestBody GoodReceiveNote goodReceiveNote) {

        // Retrieves the current authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieves the logged-in user object using the username
        User loggedUser = userDao.getByUsername(auth.getName());
        // Retrieves the privilege of the logged-in user for the "Good Receive Note" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Good Receive Note");

        // Check permission to insert a new good receive note
        if (userPrivilage.getPrivilage_insert()) {

            try {
                // Set metadata before saving
                goodReceiveNote.setAdded_datetime(LocalDateTime.now()); // Sets the current date and time
                goodReceiveNote.setAdded_user_id(loggedUser.getId()); // Sets the ID of the user who added the record
                goodReceiveNote.setCode(goodReceiveNoteDao.getNextOrderCode()); // Generates the next order code

                // Initialize the paid amount to 0 (value is saved in DB but not shown in frontend)
                goodReceiveNote.setPaid_amount(BigDecimal.ZERO);
                 
                // Iterate through each ingredient in the good receive note and set the reference
                // to the good receive note to avoid circular references
                for (GrnHasIngredients pohi : goodReceiveNote.getGrnHasItemList()) {
                    // Establishes a link between the good receive note and each ingredient line item
                    pohi.setGrn_id(goodReceiveNote);
                }

                // Save the complete good receive note object, including associated ingredients, to the database
                goodReceiveNoteDao.save(goodReceiveNote);
                

                // Loop through each ingredient item in the Good Receive Note (GRN)
                for (GrnHasIngredients ghi : goodReceiveNote.getGrnHasItemList()) {

                    // If there is no batch number provided
                    if (ghi.getBatchno()  == null) {

                        // Create a new inventory record
                        Inventory newInventory = new Inventory();

                        // Generate the next batch number automatically
                        newInventory.setBatch_number(inventoryDao.getNextBatchNo());

                        // Set the expiry date to 14 days from today
                        newInventory.setExpire_date(LocalDate.now().plusDays(14));

                        // Set the manufacture date to today's date
                        newInventory.setManufact_date(LocalDate.now());

                        // Set the available quantity from GRN quantity
                        newInventory.setAvailable_qty(ghi.getGrn_quantity());

                        // Set the total quantity from GRN quantity
                        newInventory.setTotal_qty(ghi.getGrn_quantity());

                        newInventory.setRemoved_qty(BigDecimal.ZERO);

                        // Link the ingredient to this inventory
                        newInventory.setIngredients_id(ghi.getIngredients_id());

                        // Save the new inventory to the database
                        inventoryDao.save(newInventory);

                        // If there is a batch number provided
                    } else {

                        // Try to find an existing inventory record that matches both the ingredient ID
                        // and the given batch number
                        Inventory extInventory = inventoryDao.getByIngredientBatchNumber(ghi.getIngredients_id().getId(),ghi.getBatchno());

                        // Check if such an inventory record already exists
                        if (extInventory != null) {

                            // If the inventory exists, update its available quantity by adding the new GRN
                            // quantity
                            extInventory.setAvailable_qty(extInventory.getAvailable_qty().add(ghi.getGrn_quantity()));

                            // Also update the total quantity by adding the same GRN quantity
                            extInventory.setTotal_qty(extInventory.getTotal_qty().add(ghi.getGrn_quantity()));

                            // Save the updated inventory back to the database
                            inventoryDao.save(extInventory);

                        } else {

                            // If the inventory record does not exist for this batch, create a new one
                            Inventory newInventory = new Inventory();

                            // Set the batch number from the GRN
                            newInventory.setBatch_number(ghi.getBatchno());

                            // Set expiry date to 14 days from today
                            newInventory.setExpire_date(ghi.getExpdate());

                            // Set manufacturing date to today's date
                            newInventory.setManufact_date(LocalDate.now());

                            // Set available and total quantity using the GRN quantity
                            newInventory.setAvailable_qty(ghi.getGrn_quantity());
                            newInventory.setTotal_qty(ghi.getGrn_quantity());

                            newInventory.setRemoved_qty(BigDecimal.ZERO);

                            // Link the new inventory to the appropriate ingredient
                            newInventory.setIngredients_id(ghi.getIngredients_id());

                            // Save the new inventory record to the database
                            inventoryDao.save(newInventory);
                        }

                    }
                }


                // if (goodReceiveNote.getSupplierpurchaseorder_id() != null) {

                //     PurchaseOrder purchaseOrder = purchaseOrderDao.getReferenceById(goodReceiveNote.getSupplierpurchaseorder_id().getId());

                //     purchaseOrder.setSupplierpurchaseorder_status_id(purchaseOrderStatusDao.getReferenceById(2));
                    
                //     for(PurchaseOrderHasIngredients pohi : purchaseOrder.getPurchaseOrderHasItemList()){
                //         pohi.setSupplierpurchaseorder_id(purchaseOrder);
                //     }
                //     purchaseOrderDao.save(purchaseOrder);
                // }
                
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

    // import org.springframework.web.bind.annotation.PutMapping;
    // URL → [/goodreceivenote/update]
    // Update an existing good receive note record in the database (only if user has 'update' privilege)
    // @PutMapping(value = "/goodreceivenote/update")
    
    /*public String updateGoodReceiveNoteData(@RequestBody GoodReceiveNote goodReceiveNote) {
        // Get the current authenticated user details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get the logged-in user object by username
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get the privileges for the "Good Receive Note" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Good Receive Note");

        // Check if the user has permission to update
        if (userPrivilage.getPrivilage_update()) {

            try {
                // Set metadata before updating
                goodReceiveNote.setUpdated_datetime(LocalDateTime.now()); // Set current date and time
                goodReceiveNote.setUpdated_user_id(loggedUser.getId());   // Set the updater's user ID

                // Loop through all line items and bind them to the good receive note
                for (GrnHasIngredients pohi : goodReceiveNote.getGrnHasItemList()) {
                    pohi.setGrn_id(goodReceiveNote); // Set good receive note reference to avoid circular JSON issues
                }

                // Save the good receive note with all its items to the database
                goodReceiveNoteDao.save(goodReceiveNote);
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
*/


// Handles GET requests to retrieve a list of ingredients associated with a specific supplier
// URL: [/grn/listbysupplier/1]
// URL pattern: /grn/listbysupplier/{supplierid}

@GetMapping(value = "grn/listbysupplier/{supplierid}", produces = "application/json")
public List<GoodReceiveNote> getGrnListBySupplier(@PathVariable("supplierid") Integer supplierid) {
    // Get the current authenticated user's details from Spring Security context
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    // Retrieve the user's privileges for the "Good Receive Note" module
    Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Good Receive Note");

    // Check if the user has select (view) permission for this module
    if (userPrivilage.getPrivilage_select()) {
        // User has permission, return the list of Good Receive Notes for the given
        // supplier ID
        return goodReceiveNoteDao.getGrnListBySupplier(supplierid);
    } else {
        // User lacks permission, return an empty list to restrict access
        return new ArrayList<>();
    }
}


// Handles GET requests to retrieve a list of grns associated with a pending or partially completed supplierpayment status
// URL: [/grn/listbysupplierincompletepaymentstatus/1]
// URL pattern: /grn/listbysupplierincompletepaymentstatus/{supplierid}
@GetMapping(value = "grn/listbysupplierincompletepaymentstatus/{supplierid}", produces = "application/json")
public List<GoodReceiveNote> getGrnListBySupplierIncompletePaymentStatus(@PathVariable("supplierid") Integer supplierid) {
    // Get the current authenticated user's details from Spring Security context
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    // Retrieve the user's privileges for the "Good Receive Note" module
    Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Good Receive Note");

    // Check if the user has select (view) permission for this module
    if (userPrivilage.getPrivilage_select()) {
        // User has permission, return the list of Good Receive Notes for the given
        // supplier ID
        return goodReceiveNoteDao.getGrnListBySupplierIncompletePaymentStatus(supplierid);
    } else {
        // User lacks permission, return an empty list to restrict access
        return new ArrayList<>();
    }
}


}

