package com.panaromarestaurant.model; 


import jakarta.persistence.Entity; 
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Id; 
import jakarta.persistence.Table; 

import lombok.AllArgsConstructor;
import lombok.Data; 
import lombok.NoArgsConstructor; 

@Entity // Tells Spring and JPA that this class should map to a database table
@Table(name = "unit_type") // Specifies that this class maps to the "unit_type" table in the database

@Data // Lombok annotation to auto-generate useful methods (getters, setters, etc.)
@AllArgsConstructor // Lombok will generate a constructor with all the fields
@NoArgsConstructor // Lombok will generate a no-argument constructor

public class UnitType {

    @Id // This field is the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments this field in the database
    private Integer id; // Unique ID for each unit type

    // @Column(name = "name") // Optional: Only needed if the DB column name is different
    private String name; // Name of the unit type (e.g., "Kilogram", "Litre", etc.)

}
