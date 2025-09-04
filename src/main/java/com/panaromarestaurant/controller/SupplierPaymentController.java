package com.panaromarestaurant.controller;

import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.GoodReceiveNote;
import com.panaromarestaurant.model.GrnHasIngredients;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.SupplierPayment;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.GoodReceiveNoteDao;
import com.panaromarestaurant.repository.GoodReceiveNoteStatusDao;
import com.panaromarestaurant.repository.SupplierPaymentDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// SupplierPaymentController handles all backend logic related to Supplier Payments,
// including view loading, data retrieval, creation, and update operations.
@RestController
public class SupplierPaymentController {

    // Repository for SupplierPayment entity for DB operations
    @Autowired
    private SupplierPaymentDao supplierPaymentDao;

    // Repository for User entity to fetch logged-in user details
    @Autowired
    private UserDao userDao;
    
    // Repository for GRN entity
    @Autowired
    private GoodReceiveNoteDao grnDao;

    @Autowired
    private GoodReceiveNoteStatusDao goodReceiveNoteStatusDao;

    // Controller used to retrieve user privileges for access control
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Loads the Supplier Payment HTML UI
    // URL → [GET] /supplierpayment
    @RequestMapping(value = "/supplierpayment")
    public ModelAndView loadSupplierPaymentUI() {
        // Get the authenticated user's information
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object for the Supplier Payment UI
        ModelAndView supplierPaymentUI = new ModelAndView();

        // Set the view name to the supplier payment HTML page
        supplierPaymentUI.setViewName("supplierpayment.html");

        // Add the logged-in user's username to the model (for frontend display)
        supplierPaymentUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or image path) to the model (for frontend
        // display)
        supplierPaymentUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        supplierPaymentUI.addObject("title", "Panorama Restaurant & Pub : Supplier Payment Management");

        // Return the populated ModelAndView object
        return supplierPaymentUI;

    }

    // Returns all SupplierPayment records from the database
    // Only accessible if the user has 'select' privilege
    // URL → [GET] /supplierpayment/alldata
    @GetMapping(value = "/supplierpayment/alldata", produces = "application/json")
    public List<SupplierPayment> findAllData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check privilege for the current user on the "Supplier Payment" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(
                auth.getName(), "Supplier Payment");

        // If user has permission, return all records sorted by ID descending
        if (userPrivilage.getPrivilage_select()) {
            return supplierPaymentDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // If no privilege, return an empty list
            return new ArrayList<>();
        }
    }

    // Inserts a new SupplierPayment record into the database
    // Only accessible if the user has 'insert' privilege
    // URL → [POST] /supplierpayment/insert
    @PostMapping(value = "/supplierpayment/insert")
    @Transactional
    // Controller method to handle saving of supplier payment data
    public String saveSupplierPaymentData(@RequestBody SupplierPayment supplierPayment) {

        // Get the currently authenticated user from Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the authenticated username
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check if the user has insert privileges for the "Supplier Payment" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(
                auth.getName(), "Supplier Payment");

        // If the user has insert privilege, proceed with saving
        if (userPrivilage.getPrivilage_insert()) {
            try {
                // Set current date and time when the record is added
                supplierPayment.setAdded_datetime(LocalDateTime.now());

                // Set the user ID of the person who added the record
                supplierPayment.setAdded_user_id(loggedUser.getId());

                // Generate and assign the next available bill number
                supplierPayment.setBill_no(supplierPaymentDao.getNextOrderCode());

                // Save the supplier payment entity into the database
                supplierPaymentDao.save(supplierPayment);

                // ============ Dependency Update ============

                // Get a reference to the associated GoodReceiveNote by ID
                GoodReceiveNote grn = grnDao.getReferenceById(supplierPayment.getGrn_id().getId());

                // Update the paid amount of the GRN by adding the payment amount
                grn.setPaid_amount(grn.getPaid_amount().add(supplierPayment.getPayment_amount()));

                // If the paid amount is not equal to the net amount (partial payment or unpaid)
                if (grn.getNet_amount() != grn.getPaid_amount()) {
                    
                    // Set GRN status to "Partially Paid" or similar (status ID 2)
                    grn.setGrn_status_id(goodReceiveNoteStatusDao.getReferenceById(2));
                }

                // If the paid amount matches the net amount exactly (fully paid)
                if (grn.getNet_amount().compareTo(grn.getPaid_amount()) == 0) {
                    // Set GRN status to "Fully Paid" or similar (status ID 3)
                    grn.setGrn_status_id(goodReceiveNoteStatusDao.getReferenceById(3));
                }

                // Loop through each GRN item (ingredient) and ensure the reference to the
                // parent GRN is set
                for (GrnHasIngredients pohi : grn.getGrnHasItemList()) {
                    // Link each line item explicitly back to the GRN
                    pohi.setGrn_id(grn);
                }

                // Save the updated GRN, along with its ingredient list, back to the database
                grnDao.save(grn);

                // Return success response
                return "OK";

            } catch (Exception e) {
                // If any exception occurs during save, return error message
                return "Save not completed: " + e.getMessage();
            }

        } else {
            // If the user does not have insert privileges, return access denied message
            return "Insert not completed: You don't have any permission";
        }
    }

    // Updates an existing SupplierPayment record
    // Only accessible if the user has 'update' privilege
    // URL → [PUT] /supplierpayment/update
    /* @PutMapping(value = "/supplierpayment/update")
    public String updateSupplierPaymentData(@RequestBody SupplierPayment supplierPayment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check update privilege
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(
                auth.getName(), "Supplier Payment");

        if (userPrivilage.getPrivilage_update()) {
            try {
                // Set metadata (who updated and when)
                supplierPayment.setUpdated_datetime(LocalDateTime.now());
                supplierPayment.setUpdated_user_id(loggedUser.getId());

                // Update the supplier payment record
                supplierPaymentDao.save(supplierPayment);
                return "OK";
            } catch (Exception e) {
                // Return error if update fails
                return "Update not completed: " + e.getMessage();
            }
        } else {
            // Return error if no update privilege
            return "Update not completed: You don't have any permission";
        }
    }*/
}
