    package com.panaromarestaurant; // Defines the package for this class

// Import necessary Spring Boot classes to run the application
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Marks this class as a Spring Boot application entry point
// It enables auto-configuration, component scanning, and allows Spring to start the application context
public class PanaromarestaurantApplication {

    // The main method is the entry point for the Spring Boot application
    public static void main(String[] args) {

        // Starts the Spring Boot application by running the context and bootstrapping the application
        SpringApplication.run(PanaromarestaurantApplication.class, args);
        
        // Prints a message to the console to confirm that the application has started
        System.out.println("Panorama Restaurant Application Started");
    }
} 
