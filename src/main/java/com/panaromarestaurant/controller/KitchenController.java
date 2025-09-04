package com.panaromarestaurant.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Inventory;
import com.panaromarestaurant.model.OrderHasIngredients;
import com.panaromarestaurant.model.OrderItem;
import com.panaromarestaurant.model.OrderProcess;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.InventoryDao;
import com.panaromarestaurant.repository.KitchenStatusDao;
import com.panaromarestaurant.repository.OrderDao;
import com.panaromarestaurant.repository.OrderStatusDao;
import com.panaromarestaurant.repository.UserDao;

// KitchenController handles all HTTP requests related to kitchen operations,
// including UI loading, fetching order data, updating order statuses, and managing inventory usage.
@RestController
public class KitchenController {

    // Repository for accessing user data (e.g., logged-in user details)
    @Autowired
    private UserDao userDao;

    // Controller for checking user privileges for specific modules
    @Autowired
    private UserPrivilageController userPrivilageController;

    // DAO for handling order process data
    @Autowired
    private OrderDao orderDao;

    // DAO for managing inventory records
    @Autowired
    private InventoryDao inventoryDao;

    // DAO for managing kitchen status values (e.g., New, In Progress, Completed)
    @Autowired
    private KitchenStatusDao kitchenStatusDao;

    // DAO for managing order status values
    @Autowired
    private OrderStatusDao orderstatusDao;

    // Handles GET request for the kitchen UI page
    @GetMapping(value = "/kitchen")
    public ModelAndView loadKitchenUI() {

        // Get authentication info for the logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object from the DB using username
        User logedUser = userDao.getByUsername(auth.getName());

        // Prepare a ModelAndView object to send both data and view name
        ModelAndView loadKitchenUI = new ModelAndView();

        // Set the view template name (kitchen.html)
        loadKitchenUI.setViewName("kitchen.html");

        // Add logged-in username to the model (used in the UI)
        loadKitchenUI.addObject("loggedusername", auth.getName());

        // Add logged-in user profile photo to the model
        loadKitchenUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        // Set page title
        loadKitchenUI.addObject("title", "Panorama Restaurant & Pub : Kitchen Management");

        // Return ModelAndView for rendering
        return loadKitchenUI;
    }

    // Handles GET request to retrieve orders with status NEW or IN PROGRESS
    @GetMapping(value = "/order/bynewandinprogress", produces = "application/json")
    public List<OrderProcess> findNewAndInProgressData() {

        // Get authentication info for the logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve user privileges for the "Kitchen" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Kitchen");

        // Allow data fetch only if user has SELECT privilege
        if (userPrivilage.getPrivilage_select()) {
            return orderDao.listByNewAndInProgress(); // Fetch from DB
        } else {
            return new ArrayList<>(); // Return empty list if no privilege
        }
    }

    // Handles PUT request to update order status to IN PROGRESS
    @PutMapping(value = "/kitchen/inprogressStatus")
    public String updateRecord(@RequestBody OrderProcess order) {

        // Get authentication info
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve logged-in user object
        User loggedUser = userDao.getByUsername(auth.getName());

        // Retrieve user privileges for "Kitchen"
        Privilage userPrivilege = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Kitchen");

        // Check if user can update records
        if (userPrivilege.getPrivilage_update()) {
            try {
                // Retrieve the existing order record from DB
                OrderProcess extOrder = orderDao.getReferenceById(order.getId());
                if (extOrder == null) {
                    return "Couldn't Complete Update : Order Not existe..!";
                }

                // If status is NEW, set it to IN PROGRESS and update order status accordingly
                if (order.getKitchen_status_id().getId().equals(1)) {
                    order.setKitchen_status_id(kitchenStatusDao.getReferenceById(2));
                    order.setOrder_status_id(orderstatusDao.getReferenceById(2));
                }

                // Update each order item with confirmation details
                for (OrderItem ohi : order.getOrderHasitemList()) {
                    ohi.setOrder_process_id(order);
                    ohi.setCompleted_qty(ohi.getQty());
                    ohi.setConfrim_datetime(LocalDateTime.now());
                    ohi.setConfirm_user(loggedUser.getId());
                    ohi.setIs_confirm(true);
                }

                // Backup new ingredient requirements from request
                List<OrderHasIngredients> hasIngredients = new ArrayList<>();
                for (OrderHasIngredients ohi : order.getOrderHasIngredientList()) {
                    OrderHasIngredients hasIngredient = new OrderHasIngredients();
                    hasIngredient.setIngredients_id(ohi.getIngredients_id());
                    hasIngredient.setAvailable_qty(ohi.getAvailable_qty());
                    hasIngredient.setRequired_qty(ohi.getRequired_qty());
                    hasIngredients.add(hasIngredient);
                }

                // Clear current ingredient list before merging data
                order.getOrderHasIngredientList().clear();

                // Copy ingredients from existing DB record (if any)
                if (!extOrder.getOrderHasIngredientList().isEmpty()) {
                    for (OrderHasIngredients ohi : extOrder.getOrderHasIngredientList()) {
                        OrderHasIngredients hasIngredient = new OrderHasIngredients();
                        hasIngredient.setId(ohi.getId());
                        hasIngredient.setIngredients_id(ohi.getIngredients_id());
                        hasIngredient.setAvailable_qty(ohi.getAvailable_qty());
                        hasIngredient.setRequired_qty(ohi.getRequired_qty());
                        hasIngredient.setOrder_process_id(order);
                        order.getOrderHasIngredientList().add(hasIngredient);
                    }
                }

                // Add new ingredients to the updated list
                for (OrderHasIngredients ohi : hasIngredients) {
                    OrderHasIngredients hasIngredient = new OrderHasIngredients();
                    hasIngredient.setIngredients_id(ohi.getIngredients_id());
                    hasIngredient.setAvailable_qty(ohi.getAvailable_qty());
                    hasIngredient.setRequired_qty(ohi.getRequired_qty());
                    hasIngredient.setOrder_process_id(order);
                    order.getOrderHasIngredientList().add(hasIngredient);
                }

                // Save updated order record
                orderDao.save(order);

                // If order moved to IN PROGRESS, deduct required ingredients from inventory
                if (order.getKitchen_status_id().getId().equals(2)) {
                    for (OrderHasIngredients ohi : hasIngredients) {
                        List<Inventory> extInventory = inventoryDao.getByIngredient(ohi.getIngredients_id().getId());

                        // Deduct from inventory batches until requirement is met
                        for (Inventory inty : extInventory) {
                            if (inty.getAvailable_qty().compareTo(ohi.getRequired_qty()) > -1) {
                                inty.setAvailable_qty(inty.getAvailable_qty().subtract(ohi.getRequired_qty()));
                                inventoryDao.save(inty);
                                break;
                            }
                            if (inty.getAvailable_qty().compareTo(ohi.getRequired_qty()) == -1) {
                                ohi.setRequired_qty(ohi.getRequired_qty().subtract(inty.getAvailable_qty()));
                                inty.setAvailable_qty(BigDecimal.ZERO);
                                inventoryDao.save(inty);
                            }
                        }
                    }
                }

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }

    // Handles PUT request to mark order as COMPLETED
    @PutMapping(value = "/kitchen/completedStatus")
    public String updateCompltedRecord(@RequestBody OrderProcess order) {

        // Get authentication info
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve logged-in user object
        User loggedUser = userDao.getByUsername(auth.getName());

        // Retrieve user privileges
        Privilage userPrivilege = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Kitchen");

        if (userPrivilege.getPrivilage_update()) {
            try {
                // Retrieve existing order from DB
                OrderProcess extOrder = orderDao.getReferenceById(order.getId());
                if (extOrder == null) {
                    return "Couldn't Complete Update : Order Not existe..!";
                }

                // Update status based on order type
                if (order.getKitchen_status_id().getId().equals(2)) {
                    if (order.getOrder_type_id().getName().equals("Take Away")) {
                        order.setKitchen_status_id(kitchenStatusDao.getReferenceById(3));
                        order.setOrder_status_id(orderstatusDao.getReferenceById(4));
                    } else {
                        order.setKitchen_status_id(kitchenStatusDao.getReferenceById(3));
                        order.setOrder_status_id(orderstatusDao.getReferenceById(3));
                    }
                }

                // Mark all items as completed
                for (OrderItem ohi : order.getOrderHasitemList()) {
                    ohi.setOrder_process_id(order);
                    ohi.setComplete_datetime(LocalDateTime.now());
                    ohi.setComplete_user(loggedUser.getId());
                    ohi.setIs_complete(true);
                }

                // Attach ingredients to the order process
                for (OrderHasIngredients ohi : order.getOrderHasIngredientList()) {
                    ohi.setOrder_process_id(order);
                }

                // Save updated order
                orderDao.save(order);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Couldn't Complete Update : You don't have permission..!";
        }
    }
}
