package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks as JPA entity
@Table(name = "menu_status") // Maps to "menu_status" table

@Data // Lombok: Getters, setters, equals, hashCode, toString
@AllArgsConstructor // Lombok: Constructor with all fields
@NoArgsConstructor // Lombok: No-args constructor (required by JPA)

public class MenuStatus {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Integer id; // Unique status ID

    private String name; // Status name
}
