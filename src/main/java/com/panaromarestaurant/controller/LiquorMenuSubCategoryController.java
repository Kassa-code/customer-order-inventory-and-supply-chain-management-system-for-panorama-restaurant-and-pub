package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.LiquorMenuSubCategory;
import com.panaromarestaurant.repository.LiquorMenuSubCategoryDao;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController // Declares this class as a REST controller that returns JSON
public class LiquorMenuSubCategoryController {

    @Autowired // Injects LiquorMenuSubCategoryDao to access DB
    private LiquorMenuSubCategoryDao liquorMenuSubCategoryDao;

    // URL: [/liquormenusubcategory/alldata]
    // Returns all liquor submenu subcategories
    @GetMapping(value = "/liquormenusubcategory/alldata", produces = "application/json")
    public List<LiquorMenuSubCategory> findAllData() {
        return liquorMenuSubCategoryDao.findAll();
    }

    // URL: [/liquormenusubcategory/bycategory?categoryid=1]
    // Returns subcategories for a specific liquor category
    @GetMapping(value = "/liquormenusubcategory/bycategory", params = { "categoryid" }, produces = "application/json")
    public List<LiquorMenuSubCategory> byCategory(@RequestParam("categoryid") Integer categoryid) {
        return liquorMenuSubCategoryDao.byCategory(categoryid);
    }
}
