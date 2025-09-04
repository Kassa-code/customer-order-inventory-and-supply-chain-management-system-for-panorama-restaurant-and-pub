package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, allowing it to be managed and persisted by JPA (Hibernate, etc.)
@Table(name = "submenu_status") // Maps this entity to the "submenu_status" table in the database

@Data // Lombok annotation that generates standard methods like getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok annotation that generates a constructor with all fields as parameters
@NoArgsConstructor // Lombok annotation that generates a no-argument constructor (required by JPA for entity instantiation)

public class SubMenuStatus {

    @Id // Declares this field as the primary key for the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies that the database should automatically generate the ID (auto-increment)
    private Integer id; // Unique identifier for each submenu status record

    private String name; // Represents the name or label of the submenu status (e.g., "Available", "Unavailable", "Disabled")
}
