package com.panaromarestaurant.model; 

import jakarta.persistence.Entity; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn; 
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table; 
import lombok.AllArgsConstructor; 
import lombok.Data; 
import lombok.NoArgsConstructor; 

@Entity // Declares this class as a JPA entity (maps to a database table)
@Table(name = "ingredient_subcategory") // Maps this entity to the "ingredient_subcategory" table in the database

@Data // Lombok generates getter, setter, toString, equals, hashCode methods automatically
@AllArgsConstructor // Generates a constructor with all fields as parameters
@NoArgsConstructor // Generates a no-argument constructor

public class IngredientSubCategory {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments the ID field
    private Integer id; // Unique ID for the ingredient subcategory

    private String name; // Name of the ingredient subcategory (e.g., "Rice", "Spices")

    @ManyToOne // Specifies a many-to-one relationship with the IngredientCategory entity
    @JoinColumn(name = "ingredient_category_id") // Maps this field to the foreign key column in the database
    private IngredientCategory ingredient_category_id; // The ingredient category this subcategory belongs to
}
