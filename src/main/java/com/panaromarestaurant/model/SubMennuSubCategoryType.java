package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Declares this class as a JPA entity, enabling ORM mapping to a database table
@Table(name = "submenu_subcategory_type") // Specifies that this entity maps to the "submenu_subcategory_type" table in the database

@Data // Lombok annotation to automatically generate boilerplate code: getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Lombok annotation to generate a constructor including all declared fields
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor, useful for JPA and serialization

public class SubMennuSubCategoryType {

    @Id // Identifies this field as the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configures auto-incrementing of the ID by the database
    private Integer id; // Unique identifier for the submenu subcategory type

    private String name; // Name describing the subcategory type
}
