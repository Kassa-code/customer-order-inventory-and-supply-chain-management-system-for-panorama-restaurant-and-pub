package com.panaromarestaurant.model; 


import jakarta.persistence.Entity; 
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Id; 
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data; 
import lombok.NoArgsConstructor; 

@Entity // Indicates that this class is an entity to be stored in a database
@Table(name = "package_type") // Maps this class to the "package_type" table in the database

@Data // Lombok annotation to generate boilerplate code like getters and setters
@AllArgsConstructor // Generates a constructor with all class fields
@NoArgsConstructor // Generates a default constructor with no arguments

public class PackageType {

    @Id // This field is the primary key in the database table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates ID values (usually increments automatically)
    private Integer id; // Unique identifier for the package type

    // @Column(name = "name") // Not needed unless the column name in DB is different
    private String name; // The name of the package type (e.g., "Box", "Bag", etc.)
}
