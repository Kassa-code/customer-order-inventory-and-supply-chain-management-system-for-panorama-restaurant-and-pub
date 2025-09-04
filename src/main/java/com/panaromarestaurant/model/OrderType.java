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
@Table(name = "order_type") // Maps to "order_type" table in the database

@Data // Lombok: Generates getters, setters, equals, hashCode, toString
@AllArgsConstructor // Lombok: Generates a constructor with all fields
@NoArgsConstructor // Lombok: Generates a no-args constructor (required by JPA)
public class OrderType {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates the ID (auto-increment)
    private Integer id; // Unique ID of the order type

    private String name; // Name of the order type
}
