package com.panaromarestaurant.controller; 

import org.springframework.web.bind.annotation.RestController; 

import com.panaromarestaurant.model.Module; 
import com.panaromarestaurant.repository.ModuleDao;

import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Mark this class as a REST controller to handle HTTP requests
public class ModuleController {

    @Autowired // Inject the ModuleDao dependency automatically
    private ModuleDao moduleDao;

    // Endpoint to retrieve all Module data
    // URL: [/module/alldata]
    // Returns a list of all Module records as a JSON response
    @GetMapping(value = "/module/alldata", produces = "application/json")
    public List<Module> findAllData() {
        return moduleDao.findAll(); // Fetch all Module records from the database and return as JSON
    }

}
