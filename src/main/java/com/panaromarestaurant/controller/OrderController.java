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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Customer;
import com.panaromarestaurant.model.OrderHasIngredients;
import com.panaromarestaurant.model.OrderItem;
import com.panaromarestaurant.model.OrderProcess;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.CustomerDao;
import com.panaromarestaurant.repository.KitchenStatusDao;
import com.panaromarestaurant.repository.OrderDao;
import com.panaromarestaurant.repository.OrderStatusDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// MenuController handles all HTTP requests related to menu operations (CRUD)
// Includes UI loading, data fetching, insertion, update, and soft deletion
@RestController
public class OrderController {

    // Inject User repository to fetch details of the logged-in user from the
    // database
    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilageController userPrivilageController;

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private KitchenStatusDao kitchenStatusDao;

    @Autowired
    private OrderStatusDao orderStatusDao;

    // URL → [/order]
    // Controller method to handle GET requests to the URL [/menu]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/order")
    public ModelAndView loadOrderUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadOrderUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadOrderUI.setViewName("order.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadOrderUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadOrderUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        loadOrderUI.addObject("title", "Panorama Restaurant & Pub : Customer Order Management");

        // Return the ModelAndView object to render the view along with the model data
        return loadOrderUI;
    }

    // URL → [/order/alldata]
    // Handles GET requests to fetch all menu data, typically for populating a UI
    // table
    // Access is granted only if the logged-in user has 'select' privilege for the
    // "Menu" module
    @GetMapping(value = "/order/alldata", produces = "application/json")
    public List<OrderProcess> findAllData() {

        // Retrieve the authentication details of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get the user's privileges for the "Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Order");

        // Check if the user has the 'select' privilege
        if (userPrivilage.getPrivilage_select()) {
            // If allowed, return all menu entries sorted by ID in descending order
            return orderDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // If not allowed, return an empty list
            return new ArrayList<>();
        }
    }

    // URL → [/order/bystatusready]
    // Handles GET requests to fetch all menu data, typically for populating a UI
    // table
    // Access is granted only if the logged-in user has 'select' privilege for the
    // "Menu" module
    @GetMapping(value = "/order/bystatusready", produces = "application/json")
    public List<OrderProcess> findByStatusReadyData() {

        // Retrieve the authentication details of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get the user's privileges for the "Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Order");

        // Check if the user has the 'select' privilege
        if (userPrivilage.getPrivilage_select()) {
            // If allowed, return all menu entries sorted by ID in descending order
            return orderDao.bystatusready();
        } else {
            // If not allowed, return an empty list
            return new ArrayList<>();
        }
    }

    // URL → [/order/bystatusready]
    // Handles GET requests to fetch all menu data, typically for populating a UI
    // table
    // Access is granted only if the logged-in user has 'select' privilege for the
    // "Menu" module
    @GetMapping(value = "/order/bystatusreadyandotdelivery", produces = "application/json")
    public List<OrderProcess> findByStatusReadyAndOTDeliveryData() {

        // Retrieve the authentication details of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get the user's privileges for the "Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Order");

        // Check if the user has the 'select' privilege
        if (userPrivilage.getPrivilage_select()) {
            // If allowed, return all menu entries sorted by ID in descending order
            return orderDao.bystatusreadyandotdelivery();
        } else {
            // If not allowed, return an empty list
            return new ArrayList<>();
        }
    }

    // URL → [/order/insert]
    // Insert a new order record into the database (only if user has
    // 'insert' privilege)
    @PostMapping(value = "/order/insert")
    public String saveOrderData(@RequestBody OrderProcess orderProcess) {

        // Retrieves the current authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieves the logged-in user object using the username
        User loggedUser = userDao.getByUsername(auth.getName());
        // Retrieves the privilege of the logged-in user for the "PurchaseOrder" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Order");

        // Check permission to insert a new purchase order
        if (userPrivilage.getPrivilage_insert()) {

            try {
                // Set metadata before saving
                orderProcess.setAdded_datetime(LocalDateTime.now()); // Sets the current date and time
                orderProcess.setAdded_user_id(loggedUser.getId()); // Sets the ID of the user who added the record

                if (orderProcess.getCustomer_id() != null) {
                    if (orderProcess.getCustomer_id().getName() != null
                            && orderProcess.getCustomer_id().getContactno() != null) {
                        Customer extCustomer = customerDao.getByMobile(orderProcess.getCustomer_id().getContactno());
                        if (extCustomer != null) {
                            orderProcess.setCustomer_id(extCustomer);
                        } else {
                            Customer newCustomer = customerDao.save(orderProcess.getCustomer_id());
                            orderProcess.setCustomer_id(newCustomer);
                        }
                    }
                }
                // orderProcess.setOrder_code(orderDao.getNextOrderCode()); // Generates the
                // next order code
                orderProcess.setOrder_code(orderDao.getNextOrderCode());
                orderProcess.setKitchen_status_id(kitchenStatusDao.getReferenceById(1));
                for (OrderItem pohi : orderProcess.getOrderHasitemList()) {
                    pohi.setIs_confirm(false);
                    pohi.setCompleted_qty(BigDecimal.ZERO);
                    pohi.setOrder_process_id(orderProcess);
                }

                for (OrderHasIngredients ohi : orderProcess.getOrderHasIngredientList()) {
                    ohi.setOrder_process_id(orderProcess);
                }

                // Save the complete purchase order object, including associated ingredients, to
                // the database
                orderDao.save(orderProcess);
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

    @PutMapping(value = "/order/update")
    public String updateOrderData(@RequestBody OrderProcess orderProcess) {

        // Retrieves the current authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Retrieves the logged-in user object using the username
        User loggedUser = userDao.getByUsername(auth.getName());
        // Retrieves the privilege of the logged-in user for the "PurchaseOrder" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Order");

        // Check permission to insert a new purchase order
        if (userPrivilage.getPrivilage_update()) {

            try {
                // Set metadata before saving
                orderProcess.setUpdated_datetime(LocalDateTime.now()); // Sets the current date and time
                orderProcess.setUpdated_user_id(loggedUser.getId()); // Sets the ID of the user who added the record
                if (orderProcess.getOrder_status_id().getId().equals(5)) {
                    orderProcess.setKitchen_status_id(kitchenStatusDao.getReferenceById(4));
                }

                for (OrderItem pohi : orderProcess.getOrderHasitemList()) {
                    if (pohi.getId() == null) {
                        orderProcess.setOrder_status_id(orderStatusDao.getReferenceById(1));
                        orderProcess.setKitchen_status_id(kitchenStatusDao.getReferenceById(1));
                        pohi.setCompleted_qty(BigDecimal.ZERO);
                        pohi.setIs_confirm(false);
                    }

                    pohi.setOrder_process_id(orderProcess);
                }

                for (OrderHasIngredients ohi : orderProcess.getOrderHasIngredientList()) {
                    ohi.setOrder_process_id(orderProcess);
                }

                // Save the complete purchase order object, including associated ingredients, to
                // the database
                orderDao.save(orderProcess);

                return "OK";
            } catch (Exception e) {
                // Return detailed error message if save operation fails
                return "Update not completed: " + e.getMessage();
            }
        } else {
            // Return message indicating insufficient insert privileges
            return "Update not completed: You don't have any permission";
        }
    }

    @Transactional
    @DeleteMapping(value = "/order/delete")
    public String deleteOrder(@RequestBody OrderProcess orderProcess) {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch user privileges for the "Sub Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Order");

        // Check if the user has permission to delete
        if (userPrivilage.getPrivilage_delete()) {

            // Validate: SubMenu ID must be provided
            if (orderProcess.getId() == null) {
                return "Delete not completed: Order not Exists..!";
            }

            // Attempt to fetch the existing SubMenu record by ID
            OrderProcess extOrderById = orderDao.getReferenceById(orderProcess.getId());
            if (extOrderById == null) {
                return "Delete not completed: Order not Exists..!";
            }

            if (orderProcess.getOrder_status_id().getId() != 1) {
                return "Delete not completed: Order Is Already In Process..!";
            }

            try {
                // Set metadata for soft delete
                extOrderById.setDeleted_datetime(LocalDateTime.now()); // Timestamp for deletion
                extOrderById.setDeleted_user_id(userDao.getByUsername(auth.getName()).getId());
                extOrderById.setOrder_status_id(orderStatusDao.getReferenceById(5));

                for (OrderItem pohi : orderProcess.getOrderHasitemList()) {
                  
                    pohi.setOrder_process_id(extOrderById);
                }

                for (OrderHasIngredients ohi : orderProcess.getOrderHasIngredientList()) {
                    ohi.setOrder_process_id(extOrderById);
                }

                // Persist the changes (soft delete)
                orderDao.save(extOrderById);

                return "OK"; // Deletion successful
            } catch (Exception e) {
                // Handle exception during delete process
                return "Delete not completed: " + e.getMessage();
            }

        } else {
            // User does not have delete permissions
            return "Delete not completed: You don't have any permission";
        }
    }

    // URL → [/menuview]
    // Controller method to handle GET requests to the URL [/menuview]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/menuview")
    public ModelAndView loadMenuViewUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadMenuViewUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadMenuViewUI.setViewName("menuview.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadMenuViewUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadMenuViewUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        // Return the ModelAndView object to render the view along with the model data
        return loadMenuViewUI;
    }

    // URL → [/pickupview]
    // Controller method to handle GET requests to the URL [/menuview]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/pickupview")
    public ModelAndView loadPickUpViewUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadPickUpViewViewUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadPickUpViewViewUI.setViewName("pickupview.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadPickUpViewViewUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadPickUpViewViewUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        // Return the ModelAndView object to render the view along with the model data
        return loadPickUpViewViewUI;
    }

    @GetMapping (value = "/pickup/orderlist", produces = "application/json")
     public List <OrderProcess> getAvailablePickUpOrderList (){
            return orderDao.getPickUPOrderList();
    }


    // URL → [/deliveryview]
    // Controller method to handle GET requests to the URL [/menuview]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/deliveryview")
    public ModelAndView loadDeliveryViewUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadDeliveryViewUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadDeliveryViewUI.setViewName("deliveryview.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadDeliveryViewUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadDeliveryViewUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        // Return the ModelAndView object to render the view along with the model data
        return loadDeliveryViewUI;
    }

    @GetMapping (value = "/delivery/orderlist", produces = "application/json")
     public List <OrderProcess> getAvailableDeliveryOrderList (){
            return orderDao.getDeliveryOrderList();
    }


    // URL → [/takeawayview]
    // Controller method to handle GET requests to the URL [/menuview]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/takeawayview")
    public ModelAndView loadTakeAwayViewUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadTakeAwayViewUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadTakeAwayViewUI.setViewName("takeawayview.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadTakeAwayViewUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadTakeAwayViewUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        // Return the ModelAndView object to render the view along with the model data
        return loadTakeAwayViewUI;
    }

    @GetMapping (value = "/takeaway/orderlist", produces = "application/json")
     public List <OrderProcess> getAvailableTakeAwayOrderList (){
            return orderDao.getTakeAwayOrderList();
    }


    // URL → [/dineinordersview]
    // Controller method to handle GET requests to the URL [/menuview]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/dineinordersview")
    public ModelAndView loadDineInOrdersViewUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadDineInViewUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadDineInViewUI.setViewName("dineinordersview.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadDineInViewUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadDineInViewUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        // Return the ModelAndView object to render the view along with the model data
        return loadDineInViewUI;
    }

    @GetMapping (value = "/dinein/orderlist", produces = "application/json")
     public List <OrderProcess> getAvailableDineInOrderList (){
            return orderDao.getDineInOrderList();
    }


    // URL → [/allordersview]
    // Controller method to handle GET requests to the URL [/menuview]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/allordersview")
    public ModelAndView loadAllOrdersViewUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadAllViewUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadAllViewUI.setViewName("allordersview.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadAllViewUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadAllViewUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        // Return the ModelAndView object to render the view along with the model data
        return loadAllViewUI;
    }

    @GetMapping (value = "/all/orderlist", produces = "application/json")
     public List <OrderProcess> getAvailableAllOrderList (){
            return orderDao.getAllOrderList();
    }

    // URL → [/servicechargeordersview]
    // Controller method to handle GET requests to the URL [/menuview]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/servicechargeordersview")
    public ModelAndView loadServiceChargeOrdersViewUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadServiceChargeViewUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadServiceChargeViewUI.setViewName("servicechargeordersview.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadServiceChargeViewUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadServiceChargeViewUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        // Return the ModelAndView object to render the view along with the model data
        return loadServiceChargeViewUI;
    }

    @GetMapping (value = "/servicecharge/orderlist", produces = "application/json")
     public List <OrderProcess> getAvailableServiceChargeOrderList (){
            return orderDao.getServiceChargeOrderList();
    }

}
