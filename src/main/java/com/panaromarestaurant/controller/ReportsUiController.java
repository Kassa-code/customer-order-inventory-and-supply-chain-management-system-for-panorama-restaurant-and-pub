package com.panaromarestaurant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.UserDao;

// ReportsUiController handles HTTP requests for loading UI pages related to reporting views
@RestController
public class ReportsUiController {

    // Inject UserDao to retrieve logged-in user information from the database
    @Autowired
    private UserDao userDao;

    // URL: /purchasesupplier
    // Loads the UI for the Purchase & Supplier Reports page
    @GetMapping(value = "/purchasesupplier")
    public ModelAndView loadPurchaseSupplierReportUI() {
        // Fetch the currently authenticated user's credentials from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the username from the authentication context
        User logedUser = userDao.getByUsername(auth.getName());

        // Initialize ModelAndView and set the view name to the relevant HTML file
        ModelAndView purchaseSupplierReportUI = new ModelAndView();
        purchaseSupplierReportUI.setViewName("purchasesupplier.html");

        // Add logged-in user's username to the model for display in the UI
        purchaseSupplierReportUI.addObject("loggedusername", auth.getName());

        // Add the user's photo (or path to photo) to the model for UI use
        purchaseSupplierReportUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        purchaseSupplierReportUI.addObject("title", "Panorama Restaurant & Pub : Purchase Supplier Report Page");

        // Return the fully prepared ModelAndView object to render the page
        return purchaseSupplierReportUI;
    }

    // URL: /supplierpaymentreport
    // Loads the UI for the Purchase & Supplier Reports page
    @GetMapping(value = "/supplierpaymentreport")
    public ModelAndView loadSupplierPaymentReportUI() {
        // Fetch the currently authenticated user's credentials from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the username from the authentication context
        User logedUser = userDao.getByUsername(auth.getName());

        // Initialize ModelAndView and set the view name to the relevant HTML file
        ModelAndView supplierPaymentReportUI = new ModelAndView();
        supplierPaymentReportUI.setViewName("supplierpaymentreport.html");

        // Add logged-in user's username to the model for display in the UI
        supplierPaymentReportUI.addObject("loggedusername", auth.getName());

        // Add the user's photo (or path to photo) to the model for UI use
        supplierPaymentReportUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        supplierPaymentReportUI.addObject("title", "Panorama Restaurant & Pub : Supplier Payment Report Page");

        // Return the fully prepared ModelAndView object to render the page
        return supplierPaymentReportUI;
    }

    // URL: /customerpaymentreport
    // Loads the UI for the Purchase & Supplier Reports page
    @GetMapping(value = "/customerpaymentreport")
    public ModelAndView loadCustomerPaymentReportUI() {
        // Fetch the currently authenticated user's credentials from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the username from the authentication context
        User logedUser = userDao.getByUsername(auth.getName());

        // Initialize ModelAndView and set the view name to the relevant HTML file
        ModelAndView customerPaymentReportUI = new ModelAndView();
        customerPaymentReportUI.setViewName("customerpaymentreport.html");

        // Add logged-in user's username to the model for display in the UI
        customerPaymentReportUI.addObject("loggedusername", auth.getName());

        // Add the user's photo (or path to photo) to the model for UI use
        customerPaymentReportUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        customerPaymentReportUI.addObject("title", "Panorama Restaurant & Pub : Customer Payment Report Page");

        // Return the fully prepared ModelAndView object to render the page
        return customerPaymentReportUI;
    }

    // URL: /customerpaymentbycardreport
    // Loads the UI for the Purchase & Supplier Reports page
    @GetMapping(value = "/customerpaymentbycardreport")
    public ModelAndView loadCustomerPaymentByCardReportUI() {
        // Fetch the currently authenticated user's credentials from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the username from the authentication context
        User logedUser = userDao.getByUsername(auth.getName());

        // Initialize ModelAndView and set the view name to the relevant HTML file
        ModelAndView customerPaymentByCardReportUI = new ModelAndView();
        customerPaymentByCardReportUI.setViewName("customerpaymentbycardreport.html");

        // Add logged-in user's username to the model for display in the UI
        customerPaymentByCardReportUI.addObject("loggedusername", auth.getName());

        // Add the user's photo (or path to photo) to the model for UI use
        customerPaymentByCardReportUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        customerPaymentByCardReportUI.addObject("title", "Panorama Restaurant & Pub : Customer Payment By Card Report Page");

        // Return the fully prepared ModelAndView object to render the page
        return customerPaymentByCardReportUI;
    }

    // URL: /customerpaymentreportbycash
    // Loads the UI for the Purchase & Supplier Reports page
    @GetMapping(value = "/customerpaymentreportbycash")
    public ModelAndView loadCustomerPaymentByCashReportUI() {
        // Fetch the currently authenticated user's credentials from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the username from the authentication context
        User logedUser = userDao.getByUsername(auth.getName());

        // Initialize ModelAndView and set the view name to the relevant HTML file
        ModelAndView customerPaymentByCashReportUI = new ModelAndView();
        customerPaymentByCashReportUI.setViewName("customerpaymentreportbycash.html");

        // Add logged-in user's username to the model for display in the UI
        customerPaymentByCashReportUI.addObject("loggedusername", auth.getName());

        // Add the user's photo (or path to photo) to the model for UI use
        customerPaymentByCashReportUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        customerPaymentByCashReportUI.addObject("title", "Panorama Restaurant & Pub : Customer Payment By Cash Report Page");

        // Return the fully prepared ModelAndView object to render the page
        return customerPaymentByCashReportUI;
    }

    // URL: /inventoryreportbyitem
    // Loads the UI for the Purchase & Supplier Reports page
    @GetMapping(value = "/inventoryreportbyitem")
    public ModelAndView loadInventoryReportByItemUI() {
        // Fetch the currently authenticated user's credentials from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the username from the authentication context
        User logedUser = userDao.getByUsername(auth.getName());

        // Initialize ModelAndView and set the view name to the relevant HTML file
        ModelAndView inventoryReportByItemUI = new ModelAndView();
        inventoryReportByItemUI.setViewName("inventoryreportbyitem.html");

        // Add logged-in user's username to the model for display in the UI
        inventoryReportByItemUI.addObject("loggedusername", auth.getName());

        // Add the user's photo (or path to photo) to the model for UI use
        inventoryReportByItemUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        inventoryReportByItemUI.addObject("title", "Panorama Restaurant & Pub : Inventory Report By Item Page");

        // Return the fully prepared ModelAndView object to render the page
        return inventoryReportByItemUI;
    }

    // URL: /dailysalesreport
    // Loads the UI for the Purchase & Supplier Reports page
    @GetMapping(value = "/dailysalesreport")
    public ModelAndView loadDailySalesReportUI() {
        // Fetch the currently authenticated user's credentials from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the username from the authentication context
        User logedUser = userDao.getByUsername(auth.getName());

        // Initialize ModelAndView and set the view name to the relevant HTML file
        ModelAndView dailySalesReportUI = new ModelAndView();
        dailySalesReportUI.setViewName("dailysalesreport.html");

        // Add logged-in user's username to the model for display in the UI
        dailySalesReportUI.addObject("loggedusername", auth.getName());

        // Add the user's photo (or path to photo) to the model for UI use
        dailySalesReportUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        dailySalesReportUI.addObject("title", "Panorama Restaurant & Pub : Daily Sales Report Page");

        // Return the fully prepared ModelAndView object to render the page
        return dailySalesReportUI;
    }

    // URL: /dailysalesreportbyitem
    // Loads the UI for the Purchase & Supplier Reports page
    @GetMapping(value = "/dailysalesreportbyitem")
    public ModelAndView loadDailySalesReportByItemUI() {
        // Fetch the currently authenticated user's credentials from Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Retrieve full User object using the username from the authentication context
        User logedUser = userDao.getByUsername(auth.getName());

        // Initialize ModelAndView and set the view name to the relevant HTML file
        ModelAndView dailySalesReportByItemUI = new ModelAndView();
        dailySalesReportByItemUI.setViewName("dailysalesreportbyitem.html");

        // Add logged-in user's username to the model for display in the UI
        dailySalesReportByItemUI.addObject("loggedusername", auth.getName());

        // Add the user's photo (or path to photo) to the model for UI use
        dailySalesReportByItemUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        dailySalesReportByItemUI.addObject("title", "Panorama Restaurant & Pub : Daily Sales Report By Item Page");

        // Return the fully prepared ModelAndView object to render the page
        return dailySalesReportByItemUI;
    }
}
