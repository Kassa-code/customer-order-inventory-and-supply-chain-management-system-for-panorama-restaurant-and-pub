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

import com.panaromarestaurant.model.Menu;
import com.panaromarestaurant.model.MenuHasLiquorMenu;
import com.panaromarestaurant.model.MenuHasSubMenu;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.MenuDao;
import com.panaromarestaurant.repository.MenuStatusDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// MenuController handles all HTTP requests related to menu operations (CRUD)
// Includes UI loading, data fetching, insertion, update, and soft deletion
@RestController
public class MenuController {

    // Inject Menu repository to perform database operations on the Menu entity
    @Autowired
    private MenuDao menuDao;

    // Inject User repository to fetch details of the logged-in user from the
    // database
    @Autowired
    private UserDao userDao;

    // Inject MenuStatus repository to manage the status of menu items (e.g.,
    // active, deleted)
    @Autowired
    private MenuStatusDao menuStatusDao;

    // Inject UserPrivilageController to perform privilege checks and access control
    // for the current user
    @Autowired
    private UserPrivilageController userPrivilageController;

    // URL → [/menu]
    // Controller method to handle GET requests to the URL [/menu]
    // This method is responsible for loading the menu UI page
    @GetMapping(value = "/menu")
    public ModelAndView loadMenuUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView loadMenuUI = new ModelAndView();

        // Set the view name to "menu.html", which will be resolved by the view resolver
        loadMenuUI.setViewName("menu.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        loadMenuUI.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo to the model for display in the view
        loadMenuUI.addObject("loggeduserphoto", logedUser.getUserphoto());

        loadMenuUI.addObject("title", "Panorama Restaurant & Pub : Menu Management");

        // Return the ModelAndView object to render the view along with the model data
        return loadMenuUI;
    }

    // URL → [/menu/alldata]
    // Handles GET requests to fetch all menu data, typically for populating a UI
    // table
    // Access is granted only if the logged-in user has 'select' privilege for the
    // "Menu" module
    @GetMapping(value = "/menu/alldata", produces = "application/json")
    public List<Menu> findAllData() {

        // Retrieve the authentication details of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get the user's privileges for the "Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Menu");

        // Check if the user has the 'select' privilege
        if (userPrivilage.getPrivilage_select()) {
            // If allowed, return all menu entries sorted by ID in descending order
            return menuDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // If not allowed, return an empty list
            return new ArrayList<>();
        }
    }

    // URL → [/menu/insert]
    // Handles POST requests to insert a new Menu record into the database
    // Only allowed if the user has the 'insert' privilege for the "Menu" module
    @PostMapping(value = "/menu/insert")
    public String saveLiquorMenuData(@RequestBody Menu menu) {

        // Retrieve the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get the privileges of the logged-in user for the "Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Menu");

        // Check if the user has insert permission
        if (userPrivilage.getPrivilage_insert()) {

            // Check if a menu item with the same name already exists in the database
            Menu extMenuName = menuDao.getByName(menu.getName());
            if (extMenuName != null) {
                // Prevent duplicate names and return an error message
                return "Save not completed: Entered Name " + menu.getName() + " already exists..!";
            }

            try {
                // Set metadata fields before saving
                menu.setAdded_datetime(LocalDateTime.now()); // Set the current timestamp
                menu.setAdded_user_id(loggedUser.getId()); // Set the ID of the user adding the record

                // Set the menu reference for each submenu relation before saving
                for (MenuHasSubMenu pohi : menu.getMenuHasSubMenuList()) {
                    pohi.setMenu_id(menu);
                }

                // Set the menu reference for each liquormenu relation before saving
                for (MenuHasLiquorMenu pohi : menu.getMenuHasLiquorMenuList()) {
                    pohi.setMenu_id(menu);
                }

                // Save the new menu item to the database
                menuDao.save(menu);
                return "OK"; // Return success message
            } catch (Exception e) {
                // Return failure message with exception details
                return "Save not completed: " + e.getMessage();
            }

        } else {
            // If the user doesn't have permission to insert
            return "Insert not completed: You don't have any permission";
        }
    }

    // URL → [/menu/update]
    // Handles PUT requests to update an existing Menu record
    // Only allowed if the logged-in user has 'update' privileges for the "Menu"
    // module
    @PutMapping(value = "/menu/update")
    public String updateLiquorMenuData(@RequestBody Menu menu) {

        // Retrieve the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get the user's privileges for the "Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Menu");

        // Check if the user has update permission
        if (userPrivilage.getPrivilage_update()) {

            // Validation: Ensure the Menu object has an ID (required for update)
            if (menu.getId() == null) {
                return "Update not completed: Menu not exists";
            }

            // Check if a Menu with the given ID exists in the database
            Menu extById = menuDao.getReferenceById(menu.getId());
            if (extById == null) {
                return "Update not completed: Menu not exists";
            }

            // Check if another Menu with the same name already exists (excluding current
            // ID)
            Menu extMenuByName = menuDao.getByName(menu.getName());
            if (extMenuByName != null && extMenuByName.getId() != menu.getId()) {
                return "Update not completed: Menu Name " + menu.getName() + " already exists..!";
            }

            try {
                // Set update metadata: timestamp and updating user ID
                menu.setUpdated_datetime(LocalDateTime.now());
                menu.setUpdated_user_id(loggedUser.getId());

                // Set the menu reference for each submenu relation before saving
                for (MenuHasSubMenu pohi : menu.getMenuHasSubMenuList()) {
                    pohi.setMenu_id(menu);
                }

                // Set the menu reference for each liquormenu relation before saving
                for (MenuHasLiquorMenu pohi : menu.getMenuHasLiquorMenuList()) {
                    pohi.setMenu_id(menu);
                }

                // Save the updated Menu object to the database
                menuDao.save(menu);

                return "OK"; // Return success response

            } catch (Exception e) {
                // Handle and report exceptions that occur during update
                return "Update not completed: " + e.getMessage();
            }

        } else {
            // If the user doesn't have permission to update
            return "Update not completed: You don't have any permission";
        }
    }

    // URL → [/menu/delete]
    // Handles DELETE requests to perform a soft delete on a Menu item
    // Instead of removing the record from the database, it marks it as deleted
    // Operation is only allowed if the user has 'delete' privileges
    @Transactional // Ensures the delete operation is executed within a transactional context
    @DeleteMapping(value = "/menu/delete")
    public String deleteLiquorMenu(@RequestBody Menu menu) {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch user privileges for the "Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Menu");

        // Check if the user has permission to delete
        if (userPrivilage.getPrivilage_delete()) {

            // Validate: Menu ID must be provided
            if (menu.getId() == null) {
                return "Delete not completed: Menu not Exists..!";
            }

            // Attempt to fetch the existing Menu record by ID
            Menu extMenuById = menuDao.getReferenceById(menu.getId());
            if (extMenuById == null) {
                return "Delete not completed: Menu not Exists..!";
            }

            try {
                // Set metadata for soft delete
                extMenuById.setDeleted_datetime(LocalDateTime.now()); // Timestamp for deletion
                extMenuById.setDeleted_user_id(userDao.getByUsername(auth.getName()).getId()); // Who deleted it
                extMenuById.setMenu_status_id(menuStatusDao.getReferenceById(3)); // Status ID 3 = Deleted (assumed)

                // Set the menu reference for each submenu relation before saving
                for (MenuHasSubMenu pohi : menu.getMenuHasSubMenuList()) {
                    pohi.setMenu_id(menu);
                }

                // Set the menu reference for each liquormenu relation before saving
                for (MenuHasLiquorMenu pohi : menu.getMenuHasLiquorMenuList()) {
                    pohi.setMenu_id(menu);
                }

                // Persist the changes (soft delete)
                menuDao.save(extMenuById);

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

    // URL → [/menu/byname/{name}]
    // Handles GET requests to fetch a Menu entity by its name
    // Returns the Menu object in JSON format if found
    @GetMapping(value = "/menu/byname/{name}", produces = "application/json")
    public Menu findByName(@PathVariable("name") String name) {
        return menuDao.getByName(name);
    }

     @GetMapping (value = "/menu/activelist", produces = "application/json")
     public List <Menu> getAvailableLiquorMenuList (){

            return menuDao.getAvailableMenus();
    }

}
