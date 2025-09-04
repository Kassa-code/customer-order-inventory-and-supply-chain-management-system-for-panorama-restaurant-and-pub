package com.panaromarestaurant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.panaromarestaurant.model.Privilage; 
import com.panaromarestaurant.repository.PrivilageDao; 

// Controller class to handle user privilege logic
@Controller
public class UserPrivilageController {

    @Autowired
    private PrivilageDao privilageDao; // Injects the PrivilageDao dependency

    // Define function for get privilage by given username and modulename
    public Privilage getPrivilageByUserModule(String username, String modulename) {
        Privilage userPrivilage = new Privilage(); // Create a new empty Privilage object

        // Check if the username is "Admin" or "admin"
        if (username.equalsIgnoreCase("admin")) {
            // If user is admin, grant all privileges
            userPrivilage.setPrivilage_select(true);
            userPrivilage.setPrivilage_insert(true);
            userPrivilage.setPrivilage_update(true);
            userPrivilage.setPrivilage_delete(true);
        } else {

            // Otherwise, fetch privilege data from the database using DAO
            String userPrivString = privilageDao.getUserPrivilageByUserModule(username, modulename); // Gets privileges as a comma-separated string like "1,0,1,1"

            // Split the string by commas into an array of individual privilege flags
            String userPrivArray[] = userPrivString.split(",");

            // Print the array to console for debugging
            System.out.println(userPrivString);

            // Convert string values to booleans and set corresponding privileges
            userPrivilage.setPrivilage_select(userPrivArray[0].equals("1"));
            userPrivilage.setPrivilage_insert(userPrivArray[1].equals("1"));
            userPrivilage.setPrivilage_update(userPrivArray[2].equals("1"));
            userPrivilage.setPrivilage_delete(userPrivArray[3].equals("1"));
        }

        // Return the populated Privilage object
        return userPrivilage;
    }
}
