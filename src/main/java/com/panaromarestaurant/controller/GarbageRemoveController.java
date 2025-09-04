package com.panaromarestaurant.controller;

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

import com.panaromarestaurant.model.GarbageRemove;
import com.panaromarestaurant.model.Inventory;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.GarbageRemoveDao;
import com.panaromarestaurant.repository.InventoryDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// Controller for handling all Garbage Remove operations such as UI loading, data insertion, and retrieval
@RestController
public class GarbageRemoveController {

    // Inject DAO for accessing GarbageRemove data
    @Autowired
    private GarbageRemoveDao garbageRemoveDao;

    // Inject DAO to fetch User details
    @Autowired
    private UserDao userDao;

    // Controller to manage user privilege validation
    @Autowired
    private UserPrivilageController userPrivilageController;

    @Autowired
    private InventoryDao inventoryDao;



    // Load the Garbage Remove UI view
    // URL → [GET] /garbageremove
    @RequestMapping(value = "/garbageremove")
    public ModelAndView loadGarbageRemoveUI() {
        // Get currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logedUser = userDao.getByUsername(auth.getName());

        // Prepare view for garbage remove
        ModelAndView garbageRemoveUI = new ModelAndView();
        garbageRemoveUI.setViewName("garbageremove.html");

        // Pass username and user photo to the UI
        garbageRemoveUI.addObject("loggedusername", auth.getName());
        garbageRemoveUI.addObject("loggeduserphoto", logedUser.getUserphoto());
        garbageRemoveUI.addObject("title", "Panorama Restaurant & Pub : Garbage Remove Management");

        return garbageRemoveUI;
    }

    // Retrieve all GarbageRemove records from the DB
    // URL → [GET] /garbageremove/alldata
    @GetMapping(value = "/garbageremove/alldata", produces = "application/json")
    public List<GarbageRemove> findAllData() {
        // Get logged-in user and check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Garbage Remove");

        // If user has select access, fetch and return data
        if (userPrivilage.getPrivilage_select()) {
            return garbageRemoveDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // No privilege → return empty list
            return new ArrayList<>();
        }
    }

    // Insert a new GarbageRemove record
    // URL → [POST] /garbageremove/insert
    @PostMapping(value = "/garbageremove/insert")
    @Transactional
    public String saveGarbageRemoveData(@RequestBody GarbageRemove garbageRemove) {
        // Get current user and privileges
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Garbage Remove");

        // If insert privilege is granted, try to save
        if (userPrivilage.getPrivilage_insert()) {
            try {
                garbageRemoveDao.save(garbageRemove);

                Inventory extInventory = inventoryDao.getReferenceById(garbageRemove.getInventory_id().getId());
                    
                extInventory.setAvailable_qty(extInventory.getAvailable_qty().subtract(garbageRemove.getRemoved_qty()));

                extInventory.setRemoved_qty(extInventory.getRemoved_qty().add(garbageRemove.getRemoved_qty()));
                    
                // Save the updated inventory back to the database
                inventoryDao.save(extInventory);
                return "OK";
            } catch (Exception e) {
                return "Save not completed: " + e.getMessage();
            }
        } else {
            return "Insert not completed: You don't have any permission";
        }
    }
}
