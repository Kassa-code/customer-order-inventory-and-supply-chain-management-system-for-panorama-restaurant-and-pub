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

@Entity // Declares this class as a JPA entity, so it can be persisted to a relational database
@Table(name = "submenu_sub_category") // Maps this entity to the table named "submenu_sub_category" in the database

@Data // Lombok annotation to auto-generate common methods like getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok annotation to generate a constructor that accepts all declared fields as parameters
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor (default constructor)

public class SubMenuSubCategory {

    @Id // Marks this field as the primary key for the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Indicates the primary key will be generated automatically by the database using identity strategy
    private Integer id; // Unique identifier for each submenu subcategory

    private String name; // Name of the submenu subcategory

    @ManyToOne // Establishes a many-to-one relationship with another entity (SubMenuCategory)
    @JoinColumn(name = "submenu_category_id") // Defines the foreign key column that links this entity to the submenu category table
    private SubMenuCategory submenu_category_id; // Reference to the parent submenu category this subcategory is grouped under
}
