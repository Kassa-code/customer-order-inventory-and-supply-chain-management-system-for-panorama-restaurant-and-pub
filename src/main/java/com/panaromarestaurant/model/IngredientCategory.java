package com.panaromarestaurant.model; 

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Id; 
import jakarta.persistence.Table; 
import lombok.AllArgsConstructor; 
import lombok.Data; 
import lombok.NoArgsConstructor; 

@Entity // Declares this class as a JPA entity (will map to a database table)
@Table(name = "ingredient_category") // Maps this entity to the "ingredient_category" table in the database

@Data // Generates all boilerplate code like getters, setters, equals, hashCode, toString
@AllArgsConstructor // Generates a constructor with all fields as parameters
@NoArgsConstructor // Generates a no-argument constructor

public class IngredientCategory {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Uses auto-increment strategy for the ID
    private Integer id; // Primary key for the ingredient category table

    // @Column(name = "name") // Optional: specify if database column name differs from field name
    private String name; // Name of the ingredient category (e.g., "Vegetables", "Grains")
}
