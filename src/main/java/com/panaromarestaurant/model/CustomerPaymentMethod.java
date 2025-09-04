package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, meaning it maps to a table in the database
@Table(name = "payment_method") // Maps this entity to the "payment_method" table

@Data // Lombok annotation that generates getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Generates a constructor with all fields
@NoArgsConstructor // Generates a no-argument constructor

public class CustomerPaymentMethod {

    @Id // Primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Enables auto-increment for ID
    private Integer id; // Unique identifier for each customer payment method

    private String name; // Name of the payment method (e.g., "Cash", "Credit Card", "Bank Transfer")
}
