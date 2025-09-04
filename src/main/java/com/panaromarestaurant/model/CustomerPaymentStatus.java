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
@Table(name = "payment_status") // Specifies the exact table name in the database

@Data // Lombok annotation to generate boilerplate code: getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok will generate a constructor with all fields as parameters
@NoArgsConstructor // Lombok will generate a no-argument constructor

public class CustomerPaymentStatus {

    @Id // Indicates this field is the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configures the primary key to auto-increment
    private Integer id; // Unique identifier for each customer payment status record

    private String name; // The name of the customer payment status (e.g., "Paid", "Pending", "Partially Paid")
}
