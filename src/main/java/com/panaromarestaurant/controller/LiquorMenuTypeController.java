package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.LiquorMenuType;
import com.panaromarestaurant.repository.LiquorMenuTypeDao;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Declares this class as a REST controller that returns JSON
public class LiquorMenuTypeController {

    @Autowired // Injects LiquorMenuTypeDao for DB access
    private LiquorMenuTypeDao liquorMenuTypeDao;

    // URL → [/liquormenutype/alldata]
    // Returns all liquor menu types (e.g., Regular, Large)
    @GetMapping(value = "/liquormenutype/alldata", produces = "application/json")
    public List<LiquorMenuType> findAllData() {
        return liquorMenuTypeDao.findAll();
    }
}
