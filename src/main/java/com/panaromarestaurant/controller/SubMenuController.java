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

import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.SubMenu;
import com.panaromarestaurant.model.SubmenuHasIngredients;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.SubMenuDao;
import com.panaromarestaurant.repository.SubMenuStatusDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// SubMenuController handles all HTTP requests related to submenu operations (CRUD)
// Includes UI loading, data fetching, insertion, update, and soft deletion
@RestController
public class SubMenuController {

    // Inject SubMenu repository to perform database operations on the SubMenu
    // entity
    @Autowired
    private SubMenuDao subMenuDao;

    // Inject User repository to fetch details of the logged-in user from the
    // database
    @Autowired
    private UserDao userDao;

    // Inject SubMenuStatus repository to manage the status of submenu items (e.g.,
    // active, deleted)
    @Autowired
    private SubMenuStatusDao subMenuStatusDao;

    // Inject UserPrivilageController to perform privilege checks and access control
    // for the current user
    @Autowired
    private UserPrivilageController userPrivilageController;

    // URL → [/submenu]
    // Controller method to handle GET requests to the URL [/submenu]
    // This method is responsible for loading the submenu UI page
    @GetMapping(value = "/submenu")
    public ModelAndView loadSubMenuUI() {

        // Retrieve the authentication details of the currently logged-in user from the
        // Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Use the authenticated username to fetch the complete User object from the
        // database
        User logedUser = userDao.getByUsername(auth.getName());

        // Create a ModelAndView object which will hold both model data and the view
        // name
        ModelAndView subMenuUi = new ModelAndView();

        // Set the view name to "submenu.html", which will be resolved by the view
        // resolver
        subMenuUi.setViewName("submenu.html");

        // Add the logged-in user's username to the model so it can be displayed in the
        // view
        subMenuUi.addObject("loggedusername", auth.getName());

        // Add the logged-in user's photo (or its path) to the model for display in the
        // view
        subMenuUi.addObject("loggeduserphoto", logedUser.getUserphoto());

        subMenuUi.addObject("title", "Panorama Restaurant & Pub : Sub Menu Management Page");

        // Return the ModelAndView object to render the view along with the model data
        return subMenuUi;
    }

    // URL → [/submenu/alldata]
    // Handles GET requests to fetch all submenu data, typically for populating a UI
    // table
    // Access is granted only if the logged-in user has 'select' privilege for the
    // "Sub Menu" module
    @GetMapping(value = "/submenu/alldata", produces = "application/json")
    public List<SubMenu> findAllData() {

        // Retrieve the authentication details of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Get the user's privileges for the "Sub Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Sub Menu");

        // Check if the user has the 'select' privilege
        if (userPrivilage.getPrivilage_select()) {
            // If allowed, return all submenu entries sorted by ID in descending order
            return subMenuDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // If not allowed, return an empty list
            return new ArrayList<>();
        }
    }

    // URL → [/submenu/insert]
    // Handles POST requests to insert a new SubMenu record into the database
    // Only allowed if the user has the 'insert' privilege for the "Sub Menu" module
    @PostMapping(value = "/submenu/insert")
    public String saveSubMenuData(@RequestBody SubMenu subMenu) {

        // Retrieve the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get the privileges of the logged-in user for the "Sub Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Sub Menu");

        // Check if the user has insert permission
        if (userPrivilage.getPrivilage_insert()) {

            // Check if a submenu item with the same name already exists in the database
            SubMenu extItemName = subMenuDao.getByName(subMenu.getName());
            if (extItemName != null) {
                // Prevent duplicate names and return an error message
                return "Save not completed: Entered Name " + subMenu.getName() + " already exists..!";
            }

            try {
                // Set metadata fields before saving
                subMenu.setAdded_datetime(LocalDateTime.now()); // Set the current timestamp
                subMenu.setAdded_user_id(loggedUser.getId()); // Set the ID of the user adding the record

                for (SubmenuHasIngredients pohi : subMenu.getSubmenuHasIngredientList()) {
                    pohi.setSubmenu_id(subMenu);
                }

                // Save the new submenu item to the database
                subMenuDao.save(subMenu);
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

    // URL → [/submenu/update]
    // Handles PUT requests to update an existing SubMenu record
    // Only allowed if the logged-in user has 'update' privileges for the "Sub Menu"
    // module
    @PutMapping(value = "/submenu/update")
    public String updateSubMenuData(@RequestBody SubMenu subMenu) {

        // Retrieve the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Get the user's privileges for the "Sub Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Sub Menu");

        // Check if the user has update permission
        if (userPrivilage.getPrivilage_update()) {

            // Validation: Ensure the SubMenu object has an ID (required for update)
            if (subMenu.getId() == null) {
                return "Update not completed: Sub menu not exists";
            }

            // Check if a SubMenu with the given ID exists in the database
            SubMenu extById = subMenuDao.getReferenceById(subMenu.getId());
            if (extById == null) {
                return "Update not completed: Sub menu not exists";
            }

            // Check if another SubMenu with the same name already exists (excluding current
            // ID)
            SubMenu extSubMneuByName = subMenuDao.getByName(subMenu.getName());
            if (extSubMneuByName != null && extSubMneuByName.getId() != subMenu.getId()) {
                return "Update not completed: Sub menu Name " + subMenu.getName() + " already exists..!";
            }

            try {

                // Set update metadata: timestamp and updating user ID
                subMenu.setUpdated_datetime(LocalDateTime.now());
                subMenu.setUpdated_user_id(loggedUser.getId());

                for (SubmenuHasIngredients pohi : subMenu.getSubmenuHasIngredientList()) {
                    pohi.setSubmenu_id(subMenu);
                }

                // Save the updated SubMenu object to the database
                subMenuDao.save(subMenu);

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

    // URL → [/submenu/delete]
    // Handles DELETE requests to perform a soft delete on a SubMenu item
    // Instead of removing the record from the database, it marks it as deleted
    // Operation is only allowed if the user has 'delete' privileges
    @Transactional // Ensures the delete operation is executed within a transactional context
    @DeleteMapping(value = "/submenu/delete")
    public String deleteSubMenu(@RequestBody SubMenu subMenu) {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch user privileges for the "Sub Menu" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Sub Menu");

        // Check if the user has permission to delete
        if (userPrivilage.getPrivilage_delete()) {

            // Validate: SubMenu ID must be provided
            if (subMenu.getId() == null) {
                return "Delete not completed: Sub menu not Exists..!";
            }

            // Attempt to fetch the existing SubMenu record by ID
            SubMenu extSubMenuById = subMenuDao.getReferenceById(subMenu.getId());
            if (extSubMenuById == null) {
                return "Delete not completed: Sub menu not Exists..!";
            }

            try {
                // Set metadata for soft delete
                extSubMenuById.setDeleted_datetime(LocalDateTime.now()); // Timestamp for deletion
                extSubMenuById.setDeleted_user_id(userDao.getByUsername(auth.getName()).getId()); // Who deleted it
                extSubMenuById.setSubmenu_status_id(subMenuStatusDao.getReferenceById(3)); // Status ID 3 = Deleted

                for (SubmenuHasIngredients pohi : subMenu.getSubmenuHasIngredientList()) {
                    pohi.setSubmenu_id(subMenu);
                }

                // Persist the changes (soft delete)
                subMenuDao.save(extSubMenuById);

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

    @GetMapping(value = "/submenu/byname/{name}", produces = "application/json")
    public SubMenu findByName(@PathVariable("name") String name) {
        return subMenuDao.getByName(name);
    }

    @GetMapping (value = "/submenu/activelist", produces = "application/json")
    public List <SubMenu> getAvailableSubMenuList (){

            return subMenuDao.getAvailableMenus();
    }
}
