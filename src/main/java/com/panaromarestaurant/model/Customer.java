package com.panaromarestaurant.model;

// Import validation and persistence annotations
import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Tells JPA that this class maps to a database table
@Table(name = "customer") // Maps this class to the "customer" table in the database

@Data // Lombok: Automatically adds getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok: Creates a constructor with all class fields
@NoArgsConstructor // Lombok: Creates a no-argument constructor (needed for JPA)
public class Customer {

    @Id // Marks this field as the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates the ID using database identity column
    private Integer id; // ID of the customer (unique identifier)

    private String name; // Name of the customer

    @Column(name = "contactno", unique = true) // Maps this field to "contactno" column and makes it unique
    @Length(max = 10) // Contact number should be no more than 10 characters
    private String contactno; // Contact number of the customer
}
