package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity (linked to a database table)
@Table(name = "liquormenu_category") // Maps to the "liquormenu_category" table in the database

@Data // Lombok: Auto-generates getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok: Generates constructor with all fields
@NoArgsConstructor // Lombok: Generates no-arg constructor (required by JPA)

public class LiquorMenuCategory {

    @Id // Marks 'id' as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Uses DB auto-increment for ID
    private Integer id; // Primary key of the category

    private String name; // Category name (e.g., "Whiskey", "Cocktails")
}
