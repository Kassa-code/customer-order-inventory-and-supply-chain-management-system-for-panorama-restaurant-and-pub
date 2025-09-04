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

@Entity // Marks this class as a JPA entity (maps to a DB table)
@Table(name = "liquormenu_sub_category") // Maps this entity to the "liquormenu_sub_category" table

@Data // Lombok: Generates getters, setters, equals, hashCode, toString
@AllArgsConstructor // Lombok: All-args constructor
@NoArgsConstructor // Lombok: No-args constructor (required by JPA)

public class LiquorMenuSubCategory {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB auto-increment primary key
    private Integer id; // Unique ID of the subcategory

    private String name; // Name of the subcategory (e.g., "Imported Whiskey")

    @ManyToOne // Many subcategories can belong to one category
    @JoinColumn(name = "liquormenu_category_id") // Foreign key column in DB
    private LiquorMenuCategory liquormenu_category_id; // Link to parent liquor category
}
