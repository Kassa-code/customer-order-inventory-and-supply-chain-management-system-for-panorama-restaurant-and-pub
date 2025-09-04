package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, making it a table in the database
@Table(name = "vehicle_status") // Maps this entity to the "vehicle_status" table in the database

@Data // Lombok annotation to automatically generate getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Lombok annotation to generate a constructor with all fields as arguments
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor required by JPA
public class VehicleStatus {

    @Id // Marks this field as the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies that the primary key will be generated automatically by the database (auto-increment)
    private Integer id; // Represents the unique identifier (primary key) for each VehicleStatus record

    // @Column(name = "status_name", nullable = false, length = 100)
    // This annotation is currently commented out.
    // It can be used to explicitly specify column properties like name, nullability, and length

    private String name; // Represents the name of the vehicle status (e.g., "Active", "Inactive", "Under Repair")
}
