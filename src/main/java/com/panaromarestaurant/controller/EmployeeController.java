package com.panaromarestaurant.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.panaromarestaurant.model.Employee;
import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.model.Role;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.EmployeeDao;
import com.panaromarestaurant.repository.EmployeeStatusDao;
import com.panaromarestaurant.repository.RoleDao;
import com.panaromarestaurant.repository.UserDao;

@RestController
// @RestController is a Spring annotation that combines @Controller and
// @ResponseBody.
// It indicates that this class is a controller where every method returns a
// domain object (instead of a view).
// The returned data is directly written into the HTTP response body (typically
// as JSON or XML).
// If you're building a REST API, @RestController is commonly used.

public class EmployeeController {

    @Autowired // Automatically injects an instance of EmployeeDao (Dependency Injection)
    private EmployeeDao employeeDao;

    @Autowired // Automatically injects an instance of EmployeeStatusDao
    private EmployeeStatusDao employeeStatusDao;

    @Autowired // Automatically injects an instance of UserDao
    private UserDao userDao;

    @Autowired // Automatically injects an instance of RoleDao
    private RoleDao roleDao;

    @Autowired // Automatically injects an instance of BCryptPasswordEncoder
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // Injects UserPrivilageController to check user permissions on modules
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Request Mapping for Loading Employee UI [URL → /employee]
    @RequestMapping(value = "/employee") // Maps the "/employee" URL to the loadEmployeeUi() method
    public ModelAndView loadEmployeeUi() {

        // Get the currently authenticated user's details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // ModelAndView is a Spring class used to hold both the view name and model
        // data.

        // Retrieve the full User object from the database using the authenticated
        // username
        User logedUser = userDao.getByUsername(auth.getName());
        ModelAndView employeeUi = new ModelAndView();
        // Set the name of the view to be rendered. In this case, "employee.html".
        employeeUi.setViewName("employee.html");
        employeeUi.addObject("loggedusername", auth.getName()); // Add the logged-in user's username to the model

        // Add the logged-in user's photo (or path to photo) to the model for display
        employeeUi.addObject("loggeduserphoto", logedUser.getUserphoto());
        // Return the ModelAndView object, which Spring MVC will use to render the view.
        employeeUi.addObject("title", "Panorama Restaurant & Pub : Employee Management");
        return employeeUi;
    }

    // Fetch all employee records as a JSON response [URL → /employee/alldata]
    @GetMapping(value = "/employee/alldata", produces = "application/json") // Map HTTP GET request to /employee/alldata
    public List<Employee> findAllData() {

        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch privileges of the user for the Employee module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Employee");

        // Check if user has privilege to view Employee data
        if (userPrivilage.getPrivilage_select()) {
            // Fetch and return all employees, sorted by ID in descending order
            return employeeDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
        } else {
            // Return empty list if no permission to view
            return new ArrayList<>();
        }

    }

    // Fetch employees who don't have user accounts as a JSON response [URL →
    // /employee/listuserswithoutaccount]
    @GetMapping(value = "/employee/listuserswithoutaccount", produces = "application/json") // Map HTTP GET request to /employee/listuserswithoutaccount
    public List<Employee> listUsersWithoutAccount() {
        // Fetch and return employees without a linked user account
        return employeeDao.listUsersWithoutAccount();
    }

    // Create a POST mapping for inserting employee data into the database
    // The API endpoint is: [URL → /employee/insert]
    @PostMapping(value = "/employee/insert")
    public String saveEmployeeData(@RequestBody Employee employee) {
        // @RequestBody annotation allows Spring to map the incoming JSON object to the
        // Employee object

        // Check authorization of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User logedUser = userDao.getByUsername(auth.getName()); // Get the logged-in user's information from the database
        // Fetch privileges of the user for the Employee module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Employee");

        if (userPrivilage.getPrivilage_insert()) {

            // Perform a duplicate check before saving the employee
            // Check if there is an existing employee with the same NIC
            Employee extEmployeeByNic = employeeDao.getByNIC(employee.getNic());
            if (extEmployeeByNic != null) {
                return "Save not completed: Entered NIC " + employee.getNic() + " already exists..!";
            }

            // Check if there is an existing employee with the same email
            Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
            if (extEmployeeByEmail != null) {
                return "Save not completed: Entered Email " + employee.getEmail() + " already exists..!";
            }

            // Check if there is an existing employee with the same mobile number
            Employee extEmployeeByMobile = employeeDao.getByMobile(employee.getMobileno());
            if (extEmployeeByMobile != null) {
                return "Save not completed: Entered Mobile " + employee.getMobileno() + " already exists..!";
            }

            try {
                // Set automatically generated data from the backend
                employee.setAdded_datetime(LocalDateTime.now()); // Set the current timestamp for when the employee is added
                employee.setAdded_user_id(logedUser.getId()); // Set the ID of the logged-in user who is adding the employee
                employee.setEmp_no(employeeDao.getNextEmpNo()); // Generate the next employee number

                // Save the employee record to the database
                employeeDao.save(employee);

                // Dependencies
                // If user account is needed only
                if (employee.getDesignation_id().getUseraccount()) {

                    // Handle dependencies if any (e.g., related records in other tables)
                    User user = new User(); // Create a new User object for the employee's login credentials

                    user.setUsername(employee.getEmp_no()); // Set the username for the user (use employee number as username)

                    // Check if the employee's photo is not null
                    if (employee.getEmp_photo() != null) {
                        // If a photo exists, set it as the user's photo
                        user.setUserphoto(employee.getEmp_photo());
                    }

                    user.setEmail(employee.getEmail()); // Set the user's email (same as employee's email)
                    user.setStatus(true); // Set the user's status as active
                    user.setAdded_datetime(LocalDateTime.now()); // Record the current date and time as the usercreation timestamp

                    // Set the user's password by encrypting the employee's NIC using BCrypt
                    user.setPassword(bCryptPasswordEncoder.encode(employee.getNic()));

                    // Associate the user with the corresponding employee object retrieved by NIC
                    user.setEmployee_id(employeeDao.getByNIC(employee.getNic()));

                    // Assign role to admin user
                    Set<Role> roles = new HashSet<>();
                    Role role = roleDao.getReferenceById(employee.getDesignation_id().getRoleid()); // Get the role with ID from the database
                    roles.add(role); // Add the admin role to the set of roles
                    user.setRoles(roles); // Set the roles for the user

                    // Save the admin user to the database
                    userDao.save(user);

                }

                return "OK"; // Return a success message indicating the employee and user were savedsuccessfully
            } catch (Exception e) {
                return "Save not completed: " + e.getMessage(); // Return an error message if an exception occurs
            }
        } else {

            // Return permission error if insert not allowed
            return "Insert not completed: You don't have any permission";
        }

    }

    // Define a PUT mapping for updating employee data
    // The API endpoint is: [URL → /employee/update]
    @PutMapping(value = "/employee/update")
    public String updateEmployeeData(@RequestBody Employee employee) {

        // Check authorization of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch privileges of the user for the Employee module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Employee");

        if (userPrivilage.getPrivilage_update()) {

            // Check if employee already exists
            if (employee.getId() == null) {
                return "Update not completed: Employee not exists ";
            }

            // Have sent a record but if not exists in the database
            Employee extById = employeeDao.getReferenceById(employee.getId());
            if (extById == null) {
                return "Update not completed: Employee not exists ";
            }

            // Perform a duplicate check before updating the employee
            Employee extEmployeeByNic = employeeDao.getByNIC(employee.getNic());
            if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()) {
                return "Update not completed: Entered NIC " + employee.getNic() + " already exists..!";
            }

            Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
            if (extEmployeeByEmail != null && extEmployeeByNic.getId() != employee.getId()) {
                return "Update not completed: Entered Email " + employee.getEmail() + " already exists..!";
            }

            Employee extEmployeeByMobile = employeeDao.getByMobile(employee.getMobileno());
            if (extEmployeeByMobile != null && extEmployeeByNic.getId() != employee.getId()) {
                return "Update not completed: Entered Mobile " + employee.getMobileno() + " already exists..!";
            }

            try {
                // Set automatically generated data from the backend
                employee.setUpdated_datetime(LocalDateTime.now()); // Set the current timestamp
                employee.setUpdated_user_id(1);

                // Save the updated employee record to the database
                employeeDao.save(employee);

                return "OK"; // Return success message
            } catch (Exception e) {
                return "Update not completed: " + e.getMessage(); // Return error message if an exception occurs
            }
        } else {
            // Return permission error if update not allowed
            return "Update not completed: You don't have any permission";
        }

    }

    // Create a DELETE mapping for deleting employee data from the database
    // The API endpoint is: [URL → /employee/delete]
    @DeleteMapping(value = "/employee/delete")
    public String deleteEmployee(@RequestBody Employee employee) {

        // Check authorization of the currently logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Fetch privileges of the user for the Employee module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Employee");

        if (userPrivilage.getPrivilage_delete()) {
            // Check if employee already exists
            if (employee.getId() == null) {
                return "Delete not completed: Employee not exists ";
            }

            // Have sent a record but if not exists in the database
            Employee extEmployeeById = employeeDao.getReferenceById(employee.getId());
            if (extEmployeeById == null) {
                return "Delete not completed: Employee not exists ";
            }

            try {
                // Set deletion metadata from the backend
                extEmployeeById.setDeleted_datetime(LocalDateTime.now()); // Store the deletion timestamp
                extEmployeeById.setDeleted_user_id(1);

                // Update the employee's status to "Deleted" (assuming status ID 3 represents
                // 'Deleted')
                extEmployeeById.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));

                // Update the employee record in the database (soft delete)
                employeeDao.save(extEmployeeById);

                return "OK"; // Return success message
            } catch (Exception e) {
                return "Delete not completed: " + e.getMessage(); // Return error message if an exception occurs
            }

        } else {
            // Return failure response if the user does not have delete privileges
            return "Delete not completed: You don't have any permission..!";
        }

    }

    // URL: GET /employee/waitorlistbyunassigned
    // Description: Retrieves a list of waiters who are currently unassigned to any
    // order.
    // Only returns data if the authenticated user has the "select" privilege for
    // the "Order" module.
    // Otherwise, returns an empty list.
    @GetMapping(value = "/employee/waitorlistbyunassigned", produces = "application/json")
    public List<Employee> getEmployeetList() {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check user privilege for the "Order" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Order");

        // Return the waiter list without assignment if the user has select privilege,
        // otherwise return an empty list
        if (userPrivilage.getPrivilage_select()) {
            return employeeDao.getWaitorListWithoutAssign();
        } else {
            return new ArrayList<>();
        }
    }

    // URL: GET /employee/avaibalerider
    // Description: Retrieves a list of riders who are currently available (not
    // assigned).
    // Only returns data if the authenticated user has the "select" privilege for
    // the "Order" module.
    // Otherwise, returns an empty list.
    @GetMapping(value = "/employee/avaibalerider", produces = "application/json")
    public List<Employee> getEmployeeAvailableRiderList() {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check user privilege for the "Order" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Order");

        // Return the list of available riders if the user has select privilege,
        // otherwise return an empty list
        if (userPrivilage.getPrivilage_select()) {
            return employeeDao.getAvailableRiders();
        } else {
            return new ArrayList<>();
        }
    }
}
