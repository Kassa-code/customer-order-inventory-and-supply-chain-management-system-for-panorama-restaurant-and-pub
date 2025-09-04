package com.panaromarestaurant.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.DailyOutStock;
import com.panaromarestaurant.model.Inventory;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.DailyOutStockDao;
import com.panaromarestaurant.repository.InventoryDao;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// Controller for handling HTTP requests related to DailyOutStock operations
@RestController
public class DailyOutStockController {

    // Inject DailyOutStockDao to perform DB operations on DailyOutStock entity
    @Autowired
    private DailyOutStockDao dailyOutStockDao;

    // Inject UserDao to access logged-in user data
    @Autowired
    private UserDao userDao;

    // Inject UserPrivilageController to fetch privilege information for logged-in
    // user
    @Autowired
    private UserPrivilageController userPrivilageController;

    @Autowired
    private InventoryDao inventoryDao;

    // Load DailyOutStock UI page
    // URL → GET [/dailyoutstock]
    @GetMapping(value = "/dailyoutstock")
    public ModelAndView loadDailyOutStockUI() {
        // Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logedUser = userDao.getByUsername(auth.getName());

        // Create model and view object pointing to the HTML UI
        ModelAndView dailyOutStockUI = new ModelAndView();
        dailyOutStockUI.setViewName("dailyoutstock.html");

        // Add logged-in user's name and photo to the model
        dailyOutStockUI.addObject("loggedusername", auth.getName());
        dailyOutStockUI.addObject("loggeduserphoto", logedUser.getUserphoto());
        dailyOutStockUI.addObject("title", "Panorama Restaurant & Pub : Daily Stock Out Management");

        return dailyOutStockUI;
    }

    // Retrieve all DailyOutStock records if user has SELECT permission
    // URL → GET [/dailyoutstock/alldata]
    @GetMapping(value = "/dailyoutstock/alldata", produces = "application/json")
    public List<DailyOutStock> findAllData() {
        // Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check user's privileges for "Daily Out Stock" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Daily Out Stock");

        // If user has SELECT permission, return all records sorted by ID descending
        if (userPrivilage.getPrivilage_select()) {
            return dailyOutStockDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            // Return empty list if user lacks permission
            return new ArrayList<>();
        }
    }

    // Insert a new DailyOutStock record if user has INSERT permission
    // URL → POST [/dailyoutstock/insert]
    @PostMapping(value = "/dailyoutstock/insert")
    @Transactional
    public String saveSupplierPaymentData(@RequestBody DailyOutStock dailyOutStock) {
        // Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check user's privileges for "Daily Out Stock" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(
                auth.getName(), "Daily Out Stock");

        // If user has INSERT permission, proceed to save
        if (userPrivilage.getPrivilage_insert()) {
            try {
                // Set timestamp and user ID for audit tracking
                dailyOutStock.setAdded_datetime(LocalDateTime.now());
                dailyOutStock.setAdded_user_id(loggedUser.getId());

                Inventory byOutBatch = inventoryDao.getByIngredientBatchNumber(dailyOutStock.getFrom_ingredients_id().getId(), dailyOutStock.getFrom_inventory_id().getBatch_number());

                if (byOutBatch.getAvailable_qty().compareTo(dailyOutStock.getOut_qty()) > -1) {
                    byOutBatch.setAvailable_qty(byOutBatch.getAvailable_qty().subtract(dailyOutStock.getOut_qty()));
                    inventoryDao.save(byOutBatch);
                }else{
                    return "Insert not completed: Selected Ingrident Batch Inventory not Enough..!";
                }

                Inventory inventory = new Inventory();
                inventory.setAvailable_qty(dailyOutStock.getIn_qty());
                inventory.setTotal_qty(dailyOutStock.getIn_qty());
                inventory.setRemoved_qty(BigDecimal.ZERO);
                inventory.setIngredients_id(dailyOutStock.getTo_ingredients_id());
                inventory.setBatch_number(inventoryDao.getNextBatchNo());
                inventory.setManufact_date(LocalDate.now());
                inventory.setExpire_date(LocalDate.now().plusDays(7));
                Inventory newInventory = inventoryDao.save(inventory);

                dailyOutStock.setIn_inventory_id(newInventory);
                // Save record to the database
                dailyOutStockDao.save(dailyOutStock);



                return "OK";
            } catch (Exception e) {
                // Return error message if save fails
                return "Save not completed: " + e.getMessage();
            }
        } else {
            // Return access denied message if no INSERT permission
            return "Insert not completed: You don't have any permission";
        }
    }

}
