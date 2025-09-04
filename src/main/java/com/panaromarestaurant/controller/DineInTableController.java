package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.DineInTable;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.DineInTableDao;
import com.panaromarestaurant.repository.UserDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller that handles HTTP requests and
                // returns JSON responses
public class DineInTableController {

    @Autowired // Automatically injects the DineInTableDao bean (repository)
    private DineInTableDao dineInTableDao; // DAO for accessing DineInTable entity data

    // Inject UserDao to access logged-in user data
    @Autowired
    private UserDao userDao;

    // Load DailyOutStock UI page
    // URL → GET [/dinein]
    @GetMapping(value = "/dinein")
    public ModelAndView loadDineInUI() {
        // Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logedUser = userDao.getByUsername(auth.getName());

        // Create model and view object pointing to the HTML UI
        ModelAndView dineinUI = new ModelAndView();
        dineinUI.setViewName("dinein.html");

        // Add logged-in user's name and photo to the model
        dineinUI.addObject("loggedusername", auth.getName());
        dineinUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        dineinUI.addObject("title", "Panorama Restaurant & Pub : Dine In Management");
        return dineinUI;
    }

    // Handles HTTP GET requests to /dineintable/alldata
    // Returns all dine-in table records from the database as a JSON list
    @GetMapping(value = "/dineintable/alldata", produces = "application/json")
    public List<DineInTable> findAllData() {
        return dineInTableDao.findAll(); // Fetches and returns all DineInTable records
    }

    // Handles HTTP GET requests to /dineintable/availabletable
    // Returns only the available dine-in tables (not already in use for today's
    // orders with active statuses)
    @GetMapping(value = "/dineintable/availabletable", produces = "application/json")
    public List<DineInTable> findAvaibleDineInTable() {
        return dineInTableDao.listByAvailable(); // Executes custom native query to fetch available tables
    }
}
