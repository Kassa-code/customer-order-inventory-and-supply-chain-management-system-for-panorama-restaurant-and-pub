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
@Table(name = "grn_status") // Maps this entity to the "grn_status" table
@Data // Lombok: generates getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok: all-args constructor
@NoArgsConstructor // Lombok: no-args constructor
public class GoodReceiveNoteStatus {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented ID
    private Integer id; // Unique ID for each GRN status

    private String name; // Name of the status (e.g., Pending, Approved, Cancelled)
}
