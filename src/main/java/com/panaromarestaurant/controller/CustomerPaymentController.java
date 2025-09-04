package com.panaromarestaurant.controller;

import java.math.BigDecimal;
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

import com.panaromarestaurant.model.Customer;
import com.panaromarestaurant.model.CustomerPayment;
import com.panaromarestaurant.model.OrderHasIngredients;
import com.panaromarestaurant.model.OrderItem;
import com.panaromarestaurant.model.OrderProcess;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.CustomerDao;
import com.panaromarestaurant.repository.CustomerPaymentDao;
import com.panaromarestaurant.repository.CustomerPaymentStatusDao;
import com.panaromarestaurant.repository.KitchenStatusDao;
import com.panaromarestaurant.repository.UserDao;
import com.panaromarestaurant.repository.OrderDao;
import com.panaromarestaurant.repository.OrderStatusDao;

// CustomerPaymentController handles the backend logic related to Customer Payments
@RestController
public class CustomerPaymentController {

    @Autowired // Injects the CustomerPaymentDao for database operations
    private CustomerPaymentDao customerPaymentDao;

    @Autowired // Injects the CustomerPaymentDao for database operations
    private CustomerDao customerDao;

    @Autowired // Injects the CustomerPaymentDao for database operations
    private OrderDao orderDao;

    @Autowired // Injects the CustomerPaymentDao for database operations
    private KitchenStatusDao kitchenStatusDao;

    @Autowired // Injects the CustomerPaymentDao for database operations
    private OrderStatusDao orderStatusDao;

    @Autowired // Injects the UserDao to retrieve logged-in user details
    private UserDao userDao;

    @Autowired 
    private CustomerPaymentStatusDao customerPaymentStatusDao;

    @Autowired // Injects the UserPrivilageController for privilege validation
    private UserPrivilageController userPrivilageController;

    // Loads the customer payment UI page
    // URL → [GET] /customerpayment
    @RequestMapping(value = "/customerpayment")
    public ModelAndView loadCustomerPaymentUI() {
        // Get the authenticated user's info
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve the logged-in User object
        User logedUser = userDao.getByUsername(auth.getName());

        // Create and configure the view
        ModelAndView customerPaymentUI = new ModelAndView();
        customerPaymentUI.setViewName("customerpayment.html");
        customerPaymentUI.addObject("loggedusername", auth.getName());
        customerPaymentUI.addObject("loggeduserphoto", logedUser.getUserphoto());
        customerPaymentUI.addObject("title", "Panorama Restaurant & Pub : Customer Payment Management");
        return customerPaymentUI;
    }

    // Returns all CustomerPayment records if the user has 'select' privilege
    // URL → [GET] /customerpayment/alldata
    @GetMapping(value = "/customerpayment/alldata", produces = "application/json")
    public List<CustomerPayment> findAllData() {
        // Get current user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check privilege for "Customer Payment" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(
                auth.getName(), "Customer_Payment");

        // Return data only if user has select privilege
        if (userPrivilage.getPrivilage_select()) {
            return customerPaymentDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>(); // No permission → return empty list
        }
    }

    // URL → [/customerpayment/tworderpaymentinsert]
    // Insert a new customer payment record related to an order (only if the user
    // has 'insert' privilege)
    @PostMapping(value = "/customerpayment/tworderpaymentinsert")
    public String saveOrderTWPaymentData(@RequestBody CustomerPayment customerPayment) {

        // Retrieves the currently authenticated user's security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieves the full User object from the database using the authenticated
        // username
        User loggedUser = userDao.getByUsername(auth.getName());

        // Retrieves the privilege set for the logged-in user related to the
        // "Customer_Payment" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Customer_Payment");

        // Check if the user has 'insert' permission
        if (userPrivilage.getPrivilage_insert()) {

            try {
                // Set metadata fields before saving (who and when created the record)
                customerPayment.setAdded_datetime(LocalDateTime.now()); // Set current date and time
                customerPayment.setAdded_user_id(loggedUser.getId()); // Set user ID who added the payment

                // Check if the order process is a new one (no ID assigned yet)
                if (customerPayment.getOrder_process_id().getId() == null) {

                    // Get the OrderProcess object from the CustomerPayment
                    OrderProcess orderProcess = customerPayment.getOrder_process_id();

                    // Check if the customer details are provided (name and contact number)
                    if (orderProcess.getCustomer_id().getName() != null
                            && orderProcess.getCustomer_id().getContactno() != null) {

                        // Try to find an existing customer by mobile number
                        Customer extCustomer = customerDao.getByMobile(orderProcess.getCustomer_id().getContactno());

                        if (extCustomer != null) {
                            // If existing customer found, reuse it
                            orderProcess.setCustomer_id(extCustomer);
                        } else {
                            // If not found, create a new customer record
                            Customer newCustomer = customerDao.save(orderProcess.getCustomer_id());
                            orderProcess.setCustomer_id(newCustomer);
                        }
                    }

                    // Set initial kitchen status (e.g., "New") by ID
                    orderProcess.setKitchen_status_id(kitchenStatusDao.getReferenceById(1));
                    orderProcess.setAdded_datetime(LocalDateTime.now());
                    orderProcess.setAdded_user_id(loggedUser.getId());
                    orderProcess.setOrder_code(orderDao.getNextOrderCode());

                    // Set parent orderProcess reference in all associated order items
                    for (OrderItem pohi : orderProcess.getOrderHasitemList()) {
                        pohi.setIs_confirm(false);
                        pohi.setCompleted_qty(BigDecimal.ZERO);
                        pohi.setOrder_process_id(orderProcess);
                    }

                    // Set parent orderProcess reference in all associated ingredients
                    for (OrderHasIngredients ohi : orderProcess.getOrderHasIngredientList()) {
                        ohi.setOrder_process_id(orderProcess);
                    }

                    // Save the new OrderProcess and assign it back to the payment
                    OrderProcess newOrder = orderDao.save(orderProcess);
                    customerPayment.setOrder_process_id(newOrder);
                }

                // Generate and assign the next available bill number
                customerPayment.setBill_no(customerPaymentDao.getNextOrderCode());
                customerPayment.setPayment_status_id(customerPaymentStatusDao.getReferenceById(3));
                // Save the full customer payment record including any new linked order process
                customerPaymentDao.save(customerPayment);

                // Return success message
                return "OK";
            } catch (Exception e) {
                // Catch and return any exception that occurs during the save process
                return "Save not completed: " + e.getMessage();
            }
        } else {
            // Return error message if user lacks insert permission
            return "Insert not completed: You don't have any permission";
        }
    }

    // URL → [/customerpayment/insert]
    // Insert a new customer payment record related to an order (only if the user
    // has 'insert' privilege)
    @PostMapping(value = "/customerpayment/insert")
    public String saveOrderData(@RequestBody CustomerPayment customerPayment) {

        // Retrieves the current authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieves the logged-in user object using the username from authentication
        User loggedUser = userDao.getByUsername(auth.getName());

        // Retrieves the privilege of the logged-in user for the "Customer_Payment"
        // module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Customer_Payment");

        // Check if the user has 'insert' permission
        if (userPrivilage.getPrivilage_insert()) {

            try {
                // Set metadata fields before saving
                customerPayment.setAdded_datetime(LocalDateTime.now()); // Sets the current timestamp
                customerPayment.setAdded_user_id(loggedUser.getId()); // Sets the ID of the user who created the record

                // Generate and assign the next available bill number
                customerPayment.setBill_no(customerPaymentDao.getNextOrderCode());

                // Save the main customer payment record to the database
                customerPaymentDao.save(customerPayment);

                // If an order process is linked to the customer payment, update its status and
                // associations
                if (customerPayment.getOrder_process_id() != null) {

                    // Retrieve the order process from the payment object
                    OrderProcess orderProcess = customerPayment.getOrder_process_id();

                    // Set the order status (e.g., "Paid" or "Completed") using reference ID = 4
                    orderProcess.setOrder_status_id(orderStatusDao.getReferenceById(4));

                    // Assign the parent order process to each associated order item
                    for (OrderItem pohi : orderProcess.getOrderHasitemList()) {
                        pohi.setOrder_process_id(orderProcess);
                    }

                    // Assign the parent order process to each associated ingredient item
                    for (OrderHasIngredients ohi : orderProcess.getOrderHasIngredientList()) {
                        ohi.setOrder_process_id(orderProcess);
                    }

                    // Save the updated order process along with items and ingredients
                    orderDao.save(orderProcess);
                }

                // Return success response
                return "OK";

            } catch (Exception e) {
                // Return error message if any part of the save process fails
                return "Save not completed: " + e.getMessage();
            }

        } else {
            // Return message indicating that the user lacks insert permissions
            return "Insert not completed: You don't have any permission";
        }
    }

}
