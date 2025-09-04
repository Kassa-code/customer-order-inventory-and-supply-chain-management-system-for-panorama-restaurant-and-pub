package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor; 
import lombok.Data; 
import lombok.NoArgsConstructor; 

@Entity // Declares that this class should be mapped to a database table
@Table(name = "brand") // Maps this entity to the "brand" table in the database

@Data // Lombok will auto-generate common methods like getters and setters
@AllArgsConstructor // Lombok will generate a constructor using all class fields
@NoArgsConstructor // Lombok will generate a constructor with no arguments

public class Brand {
    
    @Id // Specifies that this field is the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Enables auto-incrementing of this ID in the DB
    private Integer id; // Holds the unique identifier (primary key) for each brand

    // @Column(name = "designation") // This annotation is optional unless the column name differs
    private String name; // Holds the name of the brand (e.g., "Araliya", "Nestlé", etc.)

}
