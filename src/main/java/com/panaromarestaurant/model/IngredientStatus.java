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
@Table(name = "ingredient_status") // Specifies the table name in the database as "ingredient_status"

@Data // Lombok will automatically create getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Lombok will generate a constructor with all fields
@NoArgsConstructor // Lombok will generate a default constructor (no parameters)

public class IngredientStatus {
    
    @Id // This field is the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // The ID will be auto-incremented by the database
    private Integer id; // The unique ID for each record in the ingredient_status table

    // The "name" field represents the name/status of the ingredient
    // No need for @Column unless the column name differs from this field name
    private String name; 
}
