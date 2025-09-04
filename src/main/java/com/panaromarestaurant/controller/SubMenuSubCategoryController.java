package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.SubMenuSubCategory;
import com.panaromarestaurant.repository.SubMenuSubCategoryDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController // Marks this class as a Spring REST controller, so all methods return data (like JSON) directly
public class SubMenuSubCategoryController {

    @Autowired // Injects the SubMenuSubCategoryDao bean to perform DB operations
    private SubMenuSubCategoryDao subMenuSubCategoryDao;

    // URL → [/submenusubcategory/alldata]
    // Handles GET requests to return all SubMenuSubCategory records from the database
    // Response is returned in JSON format for use in front-end components
    @GetMapping(value = "/submenusubcategory/alldata", produces = "application/json")
    public List<SubMenuSubCategory> findAllData() {
        // Fetches and returns all records from the SubMenuSubCategory table
        return subMenuSubCategoryDao.findAll();
    }


    // Handle GET requests to "submenusubcategory/bycategory?categoryid=1" with a required query parameter
    // Example URL: submenusubcategory/bycategory?categoryid=1
    @GetMapping(value = "/submenusubcategory/bycategory",params   = {"categoryid"}, 
    produces = "application/json")

    // Binds the URL query parameter 'categoryid' to this method argument
    public List<SubMenuSubCategory> byCategory(@RequestParam("categoryid") Integer categoryid ) {
        return subMenuSubCategoryDao.byCategory(categoryid);
    }
    // Calls our custom repository method, passing in the category ID from the URL
        // ingredientSubCategoryDao.byCategory(categoryid) runs a JPQL query:
        //   SELECT sc FROM IngredientSubCategory sc WHERE sc.ingredientCategory.id = ?1
        // where ?1 is replaced by the value of 'categoryid'


}
