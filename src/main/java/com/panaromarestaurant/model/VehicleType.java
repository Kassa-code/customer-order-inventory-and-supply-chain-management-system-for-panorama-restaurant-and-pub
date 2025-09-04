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
@Table(name = "vehicle_type") // Maps this entity to the "vehicle_type" table in the database

@Data // Lombok annotation that generates getters, setters, toString, equals, and hashCode methods automatically
@AllArgsConstructor // Lombok annotation to generate a constructor with all fields as parameters
@NoArgsConstructor // Lombok annotation to generate a default no-argument constructor

public class VehicleType {

    @Id // Marks this field as the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies that the primary key is auto-incremented by the database
    private Integer id; // Unique identifier for each VehicleType record

    private String name; // Name or description of the vehicle type (e.g., "Truck", "Van", "Bike")
}
