package com.panaromarestaurant.model;

import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity
@Table(name = "vehicle") // Maps to "dinein_table" table in the database

@Data // Lombok: Generates getters, setters, equals, hashCode, toString
@AllArgsConstructor // Lombok: Constructor with all fields
@NoArgsConstructor // Lombok: No-args constructor (required by JPA)
public class Vehicle {

    @Id // Primary key field
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented ID
    private Integer id; // Unique ID for the dine-in table record

    @Length(max = 8) // Limits the length of the table number string
    private String number; // Table number or identifier (e.g., "A1", "12")
    @NotNull
    private LocalDateTime added_datetime; // Timestamp indicating when this record was created

    private LocalDateTime updated_datetime; // Timestamp indicating when this record was last updated

    private LocalDateTime deleted_datetime; // Timestamp indicating when this record was soft-deleted (if applicable)

    @NotNull
    private Integer added_user_id; // ID of the user who created this record

    private Integer updated_user_id; // ID of the user who last updated this record

    private Integer deleted_user_id; // ID of the user who performed a soft delete on this record

    @ManyToOne
    @JoinColumn(name = "type_id", referencedColumnName = "id")
    private VehicleType type_id; // Status of the dine-in table

    @ManyToOne
    @JoinColumn(name = "vehicle_status_id", referencedColumnName = "id")
    private VehicleStatus vehicle_status_id; // Employee currently assigned to this table (e.g., waiter)
}
