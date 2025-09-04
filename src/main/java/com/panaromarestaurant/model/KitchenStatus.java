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
@Table(name = "kitchen_status") // Maps to "kitchen_status" table in the database

@Data // Lombok: Generates getters, setters, equals, hashCode, toString
@AllArgsConstructor // Lombok: Constructor with all fields
@NoArgsConstructor // Lombok: No-args constructor (required by JPA)
public class KitchenStatus {

    @Id // Primary key field
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented ID
    private Integer id; // Unique status ID

    private String name; // Status name (e.g., "Pending", "Completed", etc.)
}
