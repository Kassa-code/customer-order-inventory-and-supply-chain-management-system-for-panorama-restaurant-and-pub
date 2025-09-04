package com.panaromarestaurant.controller; 

// Import necessary classes
import org.springframework.web.bind.annotation.RestController;
import com.panaromarestaurant.model.Role; 
import com.panaromarestaurant.repository.RoleDao; 
import java.util.List; 
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.web.bind.annotation.GetMapping; 

@RestController // Mark this class as a REST controller to handle HTTP requests
public class RoleController { // Define the RoleController class

    @Autowired // Inject the RoleDao dependency automatically
    private RoleDao roleDao; // Declare RoleDao object to interact with Role data

    // Endpoint to retrieve all Role data
    // URL: [/role/alldata]
    @GetMapping(value = "/role/alldata", produces = "application/json") 
    public List<Role> findAllData() { // Method to fetch all Role records
        return roleDao.findAll(); // Fetch all Role records from the database and return as JSON
    }

    // Endpoint to retrieve all Role data excluding admin
    // URL: [/role/listwithoutadmin]
    @GetMapping(value = "/role/listwithoutadmin", produces = "application/json") 
    public List<Role> listWithoutAdmin() { // Method to fetch Role records excluding admin
        return roleDao.listWithoutAdmin(); // Fetch Role records excluding admin and return as JSON
    }

    
}
