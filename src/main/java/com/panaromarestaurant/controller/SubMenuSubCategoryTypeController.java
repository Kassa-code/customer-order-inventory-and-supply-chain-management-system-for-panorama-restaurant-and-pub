package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.SubMennuSubCategoryType;
import com.panaromarestaurant.repository.SubMenuSubCategoryTypeDao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a Spring REST controller, which handles HTTP requests and returns JSON or similar responses
public class SubMenuSubCategoryTypeController {

    @Autowired // Injects an instance of SubMenuSubCategoryTypeDao to access subcategory type data from the database
    private SubMenuSubCategoryTypeDao subMenuSubCategoryTypeDao; // DAO for performing CRUD operations on SubMennuSubCategoryType

    // URL → [/submenusubcategorytype/alldata]
    // Handles GET requests to retrieve all subcategory types for submenu items
    // Returns the result list as JSON for use in UI dropdowns or related modules
    @GetMapping(value = "/submenusubcategorytype/alldata", produces = "application/json")
    public List<SubMennuSubCategoryType> findAllData() {
        return subMenuSubCategoryTypeDao.findAll();
    }
}
