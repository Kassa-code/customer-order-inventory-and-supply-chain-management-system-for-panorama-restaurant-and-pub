package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity
@Table(name = "liquormenu_type") // Maps to "liquormenu_type" table in the DB

@Data // Lombok: Generates getters, setters, equals, hashCode, toString
@AllArgsConstructor // Lombok: All-args constructor
@NoArgsConstructor // Lombok: No-args constructor (required by JPA)

public class LiquorMenuType {

    @Id // Primary key field
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generated ID (auto-increment)
    private Integer id; // Unique ID of the liquor type

    private String name; // Name of the type
}
