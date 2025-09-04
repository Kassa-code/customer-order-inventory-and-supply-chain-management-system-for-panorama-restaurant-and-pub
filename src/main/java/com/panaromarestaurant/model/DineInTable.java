package com.panaromarestaurant.model;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity
@Table(name = "dinein_table") // Maps to "dinein_table" table in the database

@Data // Lombok: Generates getters, setters, equals, hashCode, toString
@AllArgsConstructor // Lombok: Constructor with all fields
@NoArgsConstructor // Lombok: No-args constructor (required by JPA)
public class DineInTable {

    @Id // Primary key field
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented ID
    private Integer id; // Unique ID for the dine-in table record

    @Length(max = 3) // Limits the length of the table number string
    private String number; // Table number or identifier (e.g., "A1", "12")

    @ManyToOne
    @JoinColumn(name = "dinein_table_status_id", referencedColumnName = "id")
    private DineInTableStatus dinein_table_status_id; // Status of the dine-in table

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee_id; // Employee currently assigned to this table (e.g., waiter)
}
